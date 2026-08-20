/**
 * HINCH MART — Auth Types
 * Updated for mobile-OTP authentication & registration flow
 */

export type AccountType = 'individual' | 'business' | 'vendor' | 'contractor';

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string | null;
  accountType: AccountType;
  isVerified: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  businessProfile: BusinessProfile | null;
  language: string;
  currency: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessProfile {
  id: string;
  companyName: string;
  companyLogo: string | null;
  registrationNumber: string;
  taxId: string;
  industry: string;
  website: string;
  description: string;
  employeeCount: string;
  annualRevenue: string;
  foundedYear: number;
  certifications: string[];
  isVerified: boolean;
}

// ── OTP-Based Auth Request/Response Types ─────────────────────────

export interface SendOTPRequest {
  phone: string;
}

export interface SendOTPResponse {
  otpRequestId: string;
  expiresIn: number;
  message: string;
}

export interface VerifyOTPRequest {
  phone: string;
  otp: string;
  otpRequestId?: string;
}

export interface VerifyOTPResponse {
  isNewUser: boolean;
  user?: User;
  tokens?: TokenPairData;
  registrationToken?: string;
}

export interface TokenPairData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  phone: string;
  fullName: string;
  email?: string;
  businessName?: string;
  accountType: AccountType;
  gstin?: string;
  pan?: string;
  companyName?: string;
  registrationToken?: string;
}

export interface RegisterResponse {
  user: User;
  tokens: TokenPairData;
}

// ── Legacy Types (kept for backward compat) ───────────────────────

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  accountType: AccountType;
  businessProfile?: Partial<BusinessProfile>;
  agreeToTerms: boolean;
}

export interface OTPVerifyRequest {
  email?: string;
  phone?: string;
  otp: string;
  type: 'signup' | 'login' | 'reset-password';
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// ── Redux Auth State ──────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  biometricEnabled: boolean;
  hasCompletedOnboarding: boolean;
  /** Phone number used during OTP login flow */
  phone: string | null;
  /** Server-issued request ID for OTP verification */
  otpRequestId: string | null;
  /** Whether the verified phone belongs to a new (unregistered) user */
  isNewUser: boolean;
  /** Temporary token issued after OTP verify, required for registration */
  registrationToken: string | null;
}
