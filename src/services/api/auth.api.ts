/**
 * HINCH MART — Auth API Service
 * Updated with mobile-OTP endpoints (sendOTP, verifyOTP, register)
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
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  RegisterRequest,
  RegisterResponse,
} from '../../types/auth.types';

export const authApi = {
  // ── OTP-Based Auth (New Flow) ─────────────────────────────────

  /** Send OTP to the given mobile number */
  sendOTP: (data: SendOTPRequest) =>
    apiClient.post<ApiResponse<SendOTPResponse>>(
      API_ENDPOINTS.AUTH.SEND_OTP,
      data
    ),

  /** Verify OTP code for a phone number */
  verifyOTP: (data: VerifyOTPRequest) =>
    apiClient.post<ApiResponse<VerifyOTPResponse>>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      data
    ),

  /** Register a new user after OTP verification */
  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<RegisterResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    ),

  /** Resend OTP to the given phone/email */
  resendOTP: (data: { email?: string; phone?: string; type: string }) =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.RESEND_OTP, data),

  // ── Legacy Auth Methods ───────────────────────────────────────

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

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<TokenPair>>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken }),
};
