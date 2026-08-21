/**
 * HINCH MART — Authentication Configuration
 *
 * Centralized settings for frontend OTP authentication and development mode.
 * Set `developmentMode: false` when connecting to the live backend OTP API.
 */
import { User } from '../types/auth.types';

export const AUTH_CONFIG = {
  /**
   * Set to `true` for frontend-only development mode using manual OTP.
   * Set to `false` in production or when connecting to real backend OTP endpoints.
   */
  developmentMode: process.env.EXPO_PUBLIC_USE_MOCK_AUTH === 'true',

  /**
   * Manual fixed OTP code accepted during development.
   */
  developmentOtp: '123456',

  /**
   * Number of digits in the OTP code.
   */
  otpLength: 6,

  /**
   * Resend cooldown duration in seconds.
   */
  resendSeconds: 45,

  /**
   * List of 10-digit phone numbers considered existing users in development mode.
   * If a user enters any of these numbers, OTP verification logs them directly into MainTabs.
   * Any other number is routed to the New User Registration screen.
   */
  mockExistingUsers: [
    '9876543210',
    '+919876543210',
  ],

  /**
   * Pre-configured mock profile for existing users.
   */
  mockExistingUserProfiles: {
    '9876543210': {
      id: 'usr_mock_9876543210',
      phone: '+919876543210',
      firstName: 'Rajesh',
      lastName: 'Sharma',
      fullName: 'Rajesh Sharma',
      email: 'rajesh.sharma@hinchmart.com',
      accountType: 'business' as const,
      businessProfile: {
        companyName: 'Apex Construction Ltd',
        gstNumber: '27AABCU9603R1ZM',
      },
      isVerified: true,
      isPhoneVerified: true,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as User,
  } as Record<string, User>,
};

export default AUTH_CONFIG;
