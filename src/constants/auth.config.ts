/**
 * HINCH MART — Authentication Configuration
 * Toggle developmentMode for testing vs production API calls.
 */

export const AUTH_CONFIG = {
  /**
   * When true, OTP verification is bypassed with devOtp,
   * and devPhone is treated as an existing registered user.
   * Set to false before production builds.
   */
  developmentMode: true,

  /** Dev-mode bypass OTP code */
  devOtp: '123456',

  /** Dev-mode phone that auto-resolves as "existing user" */
  devPhone: '9876543210',

  /** OTP input length */
  otpLength: 6,

  /** Seconds before the Resend OTP button becomes active */
  resendSeconds: 60,

  /** Mobile number validation (Indian 10-digit, starts with 6-9) */
  phoneRegex: /^[6-9]\d{9}$/,

  /** GSTIN regex — 15 alphanumeric characters */
  gstinRegex: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,

  /** PAN regex — 10 alphanumeric characters */
  panRegex: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,

  /** API endpoint patterns */
  endpoints: {
    sendOtp: '/auth/send-otp',
    verifyOtp: '/auth/verify-otp',
    register: '/auth/register',
    refreshToken: '/auth/refresh-token',
  },

  /** Dev-mode mock user for existing phone (9876543210) */
  devMockUser: {
    user: {
      id: 'dev_u1',
      email: 'demo@hinchmart.com',
      phone: '+91 98765 43210',
      firstName: 'Anusha',
      lastName: 'Demo',
      fullName: 'Anusha Demo',
      avatar: null,
      accountType: 'business' as const,
      isVerified: true,
      isPhoneVerified: true,
      isEmailVerified: true,
      businessProfile: {
        id: 'dev_b1',
        companyName: 'Anusha Global Construction Ltd',
        companyLogo: null,
        registrationNumber: 'REG-99482',
        taxId: 'TAX-0041',
        industry: 'Commercial Construction & Procurement',
        website: 'https://hinchmart.com',
        description: 'General contractors for infrastructure & high-rise construction',
        employeeCount: '50-100',
        annualRevenue: '$10M-$50M',
        foundedYear: 2018,
        certifications: ['ISO 9001', 'LEED Certified', 'B2B Verified Supplier'],
        isVerified: true,
      },
      language: 'en',
      currency: 'USD',
      timezone: 'UTC',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    tokens: {
      accessToken: 'dev_access_token_hinchmart',
      refreshToken: 'dev_refresh_token_hinchmart',
      expiresIn: 86400,
    },
  },
} as const;
