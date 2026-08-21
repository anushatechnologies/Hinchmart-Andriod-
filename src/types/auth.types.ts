/**
 * HINCH MART — Authentication Types
 *
 * Phone Number + OTP Authentication
 */

/**
 * OTP purpose.
 *
 * login    → Existing/new user login flow
 * register → Registration flow
 */
export type OTPPurpose =
  | 'login'
  | 'register';

/**
 * Supported HINCH MART account types.
 */
export type AccountType =
  | 'individual'
  | 'business'
  | 'contractor'
  | 'vendor';

/**
 * User information returned by the backend.
 */
export interface User {
  id: string;

  phone: string;

  firstName: string;

  lastName: string;

  /**
   * Email is optional.
   */
  email?: string | null;

  /**
   * Account type.
   */
  accountType: AccountType;

  /**
   * Optional display name.
   */
  fullName?: string;

  /**
   * Optional profile image.
   */
  avatar?: string | null;

  /**
   * Verification status.
   */
  isVerified?: boolean;

  /**
   * Phone verification status.
   */
  isPhoneVerified?: boolean;

  /**
   * Email verification status.
   */
  isEmailVerified?: boolean;

  /**
   * Optional language preference.
   */
  language?: string;

  /**
   * Optional currency preference.
   */
  currency?: string;

  /**
   * Business profile details.
   */
  businessProfile?: any | null;

  reviewCount?: number;

  createdAt?: string;

  updatedAt?: string;
}

/**
 * Send OTP request.
 */
export interface SendOtpRequest {
  phone: string;

  purpose: OTPPurpose;
}

/**
 * Send OTP response.
 */
export interface SendOtpResponse {
  success: boolean;

  message: string;

  /**
   * OTP expiry time in seconds.
   * Backend example: 300 seconds.
   */
  expiresIn?: number;

  /**
   * Resend cooldown in seconds.
   * Backend example: 60 seconds.
   */
  resendAfter?: number;
}

/**
 * Verify OTP request.
 */
export interface VerifyOtpRequest {
  phone: string;

  /**
   * Six-digit OTP.
   */
  otp: string;

  purpose: OTPPurpose;
}

/**
 * Existing user response after OTP verification.
 */
export interface ExistingUserAuthResponse {
  success: boolean;

  isNewUser: false;

  accessToken: string;

  refreshToken: string;

  user: User;
}

/**
 * New user response after OTP verification.
 */
export interface NewUserVerificationResponse {
  success: boolean;

  isNewUser: true;

  /**
   * Backend-generated token proving
   * that the phone number was successfully verified.
   */
  verificationToken: string;
}

/**
 * OTP verification response.
 *
 * Existing user → authentication tokens
 *
 * New user → registration verification token
 */
export type VerifyOtpResponse =
  | ExistingUserAuthResponse
  | NewUserVerificationResponse;

/**
 * Registration request.
 */
export interface RegisterRequest {
  /**
   * Token returned after successful OTP
   * verification for a new user.
   */
  verificationToken: string;

  firstName: string;

  lastName: string;

  /**
   * Optional email.
   */
  email?: string | null;

  accountType: AccountType;

  /**
   * Required for:
   * business
   * contractor
   * vendor
   *
   * Not required for:
   * individual
   */
  companyName?: string | null;
}

/**
 * Registration response.
 */
export interface RegisterResponse {
  success: boolean;

  user: User;

  accessToken: string;

  refreshToken: string;
}

/**
 * Authentication state.
 */
export interface AuthState {
  user: User | null;

  accessToken: string | null;

  refreshToken: string | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  /**
   * Whether biometric authentication is enabled.
   */
  biometricEnabled: boolean;

  /**
   * Whether onboarding has been completed.
   */
  hasCompletedOnboarding: boolean;
}