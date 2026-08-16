/**
 * HINCH MART — Auth Types
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

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  biometricEnabled: boolean;
  hasCompletedOnboarding: boolean;
}
