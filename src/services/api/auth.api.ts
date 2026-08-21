/**
 * HINCH MART — Authentication API Service
 *
 * Phone Number + OTP Authentication Architecture.
 *
 * In Development Mode (`AUTH_CONFIG.developmentMode === true`):
 * - Accepts ONLY manual OTP (`123456`)
 * - Simulates instant mock OTP response without external SMS API calls
 * - Identifies existing users (`9876543210`) vs new users
 * - Creates mock user & session tokens for registration
 *
 * In Live Mode (`AUTH_CONFIG.developmentMode === false`):
 * - Delegates all calls to backend REST API endpoints
 */
import { AxiosResponse } from 'axios';
import apiClient from './client';
import { API_ENDPOINTS } from '../../constants/api';
import { ApiResponse, TokenPair } from '../../types/api.types';
import {
  User,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  RegisterRequest,
  ExistingUserAuthResponse,
  NewUserVerificationResponse,
} from '../../types/auth.types';
import { AUTH_CONFIG } from '../../config/authConfig';
import { tokenService } from '../tokenService';

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

function createMockAxiosResponse<T>(
  data: T,
  message = 'Success',
  statusCode = 200
): AxiosResponse<ApiResponse<T>> {
  return {
    data: {
      success: true,
      data,
      message,
      statusCode,
    },
    status: statusCode,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
}

export const authApi = {
  /**
   * Send OTP to phone number for login or registration
   * POST /api/auth/send-otp
   */
  sendOtp: async (
    data: SendOtpRequest
  ): Promise<AxiosResponse<ApiResponse<SendOtpResponse>>> => {
    if (AUTH_CONFIG.developmentMode) {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const digits = data.phone.replace(/\D/g, '');
      if (digits.length < 10) {
        throw new Error('Please enter a valid 10-digit mobile number.');
      }

      return createMockAxiosResponse<SendOtpResponse>(
        {
          success: true,
          message: 'OTP sent successfully',
          expiresIn: 300,
          resendAfter: AUTH_CONFIG.resendSeconds,
        },
        'OTP sent successfully'
      );
    }

    const identifier = (data as any).identifier || data.phone;
    return apiClient.post<ApiResponse<SendOtpResponse>>(
      API_ENDPOINTS.AUTH.SEND_OTP,
      {
        identifier,
        purpose: 'LOGIN',
      }
    );
  },

  /**
   * Verify OTP entered by user
   * POST /api/auth/verify-otp
   */
  verifyOtp: async (
    data: VerifyOtpRequest & { identifier?: string; otpCode?: string }
  ): Promise<AxiosResponse<ApiResponse<VerifyOtpResponse>>> => {
    if (AUTH_CONFIG.developmentMode) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Strict validation: Only accept configured development OTP (123456)
      if (data.otp !== AUTH_CONFIG.developmentOtp) {
        const error: any = new Error('Invalid OTP. Please enter the correct OTP.');
        error.statusCode = 400;
        throw error;
      }

      const digits = data.phone.replace(/\D/g, '');
      const last10 = digits.slice(-10);

      // Check if phone matches any known existing mock user
      const isExisting = AUTH_CONFIG.mockExistingUsers.some((u) => {
        const uDigits = u.replace(/\D/g, '');
        return uDigits.endsWith(last10);
      });

      if (isExisting) {
        const existingProfile =
          AUTH_CONFIG.mockExistingUserProfiles[last10] ||
          AUTH_CONFIG.mockExistingUserProfiles['9876543210'];

        const existingResponse: ExistingUserAuthResponse = {
          success: true,
          isNewUser: false,
          accessToken: 'mock_jwt_access_token_' + Date.now(),
          refreshToken: 'mock_jwt_refresh_token_' + Date.now(),
          user: existingProfile,
        };

        return createMockAxiosResponse<VerifyOtpResponse>(
          existingResponse,
          'OTP verified successfully'
        );
      }

      // New user path
      const newResponse: NewUserVerificationResponse = {
        success: true,
        isNewUser: true,
        verificationToken: `mock_vtok_${last10}_${Date.now()}`,
      };

      return createMockAxiosResponse<VerifyOtpResponse>(
        newResponse,
        'OTP verified successfully'
      );
    }

    const identifier = data.identifier || data.phone;
    const otpCode = data.otpCode || data.otp;
    const response = await apiClient.post<any>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      {
        identifier,
        otpCode,
        purpose: 'LOGIN',
      }
    );

    // Map backend user object if returned in data
    if (response.data && response.data.data) {
      const resData = response.data.data;
      if (resData.accessToken && resData.user) {
        const rawUser = resData.user;
        const fullName = rawUser.fullName || 'Valued Customer';
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || 'Valued';
        const lastName = nameParts.slice(1).join(' ') || 'Customer';

        const mappedUser: User = {
          id: String(rawUser.id),
          phone: rawUser.phone || '',
          email: rawUser.email || null,
          firstName,
          lastName,
          fullName,
          accountType: rawUser.role === 'BUYER' ? 'business' : 'individual',
          businessProfile: rawUser.buyerProfile ? {
            companyName: rawUser.buyerProfile.companyName || 'Apex Infra Projects Pvt Ltd',
            gstNumber: rawUser.buyerProfile.gstin,
          } : { companyName: rawUser.companyName || 'Apex Infra Projects Pvt Ltd' },
          isVerified: true,
          isPhoneVerified: true,
          isEmailVerified: !!rawUser.email,
          createdAt: rawUser.createdAt || new Date().toISOString(),
          updatedAt: rawUser.createdAt || new Date().toISOString(),
        };

        const existingResponse: ExistingUserAuthResponse = {
          success: true,
          isNewUser: false,
          accessToken: resData.accessToken,
          refreshToken: resData.refreshToken,
          user: mappedUser,
        };

        return {
          ...response,
          data: {
            ...response.data,
            data: existingResponse as any,
          },
        };
      }
    }

    return response;
  },

  /**
   * Register a new user after OTP verification
   * POST /api/auth/register
   */
  register: async (
    data: RegisterRequest & { phone?: string }
  ): Promise<AxiosResponse<ApiResponse<AuthTokenResponse>>> => {
    if (AUTH_CONFIG.developmentMode) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!data.firstName?.trim() || !data.lastName?.trim()) {
        throw new Error('Please fill in all required fields.');
      }

      // Extract phone from verificationToken if possible
      let userPhone = data.phone || '';
      if (!userPhone && data.verificationToken) {
        const parts = data.verificationToken.split('_');
        if (parts.length >= 3) {
          userPhone = `+91${parts[2]}`;
        }
      }
      if (!userPhone) userPhone = '+919999999999';

      const mockUser: User = {
        id: `usr_${Date.now()}`,
        phone: userPhone,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        fullName: `${data.firstName.trim()} ${data.lastName.trim()}`,
        email: data.email?.trim() || null,
        accountType: data.accountType,
        businessProfile: data.companyName?.trim()
          ? { companyName: data.companyName.trim() }
          : null,
        isVerified: true,
        isPhoneVerified: true,
        isEmailVerified: !!data.email?.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const authData: AuthTokenResponse = {
        accessToken: `mock_jwt_access_token_${Date.now()}`,
        refreshToken: `mock_jwt_refresh_token_${Date.now()}`,
        user: mockUser,
      };

      return createMockAxiosResponse<AuthTokenResponse>(
        authData,
        'Account created successfully'
      );
    }

    return apiClient.post<ApiResponse<AuthTokenResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
  },

  /**
   * Get current authenticated user profile
   * GET /api/auth/me
   */
  getMe: async (): Promise<AxiosResponse<ApiResponse<User>>> => {
    if (AUTH_CONFIG.developmentMode) {
      const user = tokenService.getUser();
      return createMockAxiosResponse<User>(
        user || AUTH_CONFIG.mockExistingUserProfiles['9876543210'],
        'User fetched successfully'
      );
    }

    return apiClient.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
  },

  /**
   * Alias for getMe
   */
  getCurrentUser: async (): Promise<AxiosResponse<ApiResponse<User>>> => {
    return authApi.getMe();
  },

  /**
   * Refresh JWT access token using refresh token
   * POST /api/auth/refresh-token
   */
  refreshToken: async (
    refreshToken: string
  ): Promise<AxiosResponse<ApiResponse<TokenPair>>> => {
    if (AUTH_CONFIG.developmentMode) {
      return createMockAxiosResponse<TokenPair>(
        {
          accessToken: `mock_refreshed_access_${Date.now()}`,
          refreshToken: `mock_refreshed_refresh_${Date.now()}`,
          expiresIn: 3600,
        },
        'Token refreshed'
      );
    }

    return apiClient.post<ApiResponse<TokenPair>>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
  },

  /**
   * Logout current session
   * POST /api/auth/logout
   */
  logout: async (): Promise<AxiosResponse<ApiResponse<null>>> => {
    if (AUTH_CONFIG.developmentMode) {
      return createMockAxiosResponse<null>(null, 'Logged out successfully');
    }

    return apiClient.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT);
  },
};

export default authApi;