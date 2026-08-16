/**
 * HINCH MART — Auth API Service
 */
import apiClient from './client';
import { API_ENDPOINTS } from '../../constants/api';
import { ApiResponse, TokenPair } from '../../types/api.types';
import {
  User,
  LoginRequest,
  SignupRequest,
  OTPVerifyRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../../types/auth.types';

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<{ user: User; tokens: TokenPair }>>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    ),

  signup: (data: SignupRequest) =>
    apiClient.post<ApiResponse<{ user: User; tokens: TokenPair }>>(
      API_ENDPOINTS.AUTH.SIGNUP,
      data
    ),

  logout: () =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT),

  verifyOTP: (data: OTPVerifyRequest) =>
    apiClient.post<ApiResponse<{ user: User; tokens: TokenPair }>>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      data
    ),

  resendOTP: (data: { email?: string; phone?: string; type: string }) =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.RESEND_OTP, data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<TokenPair>>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken }),
};
