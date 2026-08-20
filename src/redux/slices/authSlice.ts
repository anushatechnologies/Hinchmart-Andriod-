/**
 * HINCH MART — Auth Redux Slice
 * Updated for mobile-OTP authentication flow
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types/auth.types';
import { TokenPair } from '../../types/api.types';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  biometricEnabled: false,
  hasCompletedOnboarding: false,
  phone: null,
  otpRequestId: null,
  isNewUser: false,
  registrationToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; tokens: TokenPair }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.tokens.accessToken;
      state.refreshToken = action.payload.tokens.refreshToken;
      state.isAuthenticated = true;
      state.hasCompletedOnboarding = true;
      state.isLoading = false;
      // Clear OTP flow state on successful login
      state.phone = null;
      state.otpRequestId = null;
      state.isNewUser = false;
      state.registrationToken = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setTokens: (state, action: PayloadAction<TokenPair>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setBiometricEnabled: (state, action: PayloadAction<boolean>) => {
      state.biometricEnabled = action.payload;
    },
    setOnboardingComplete: (state) => {
      state.hasCompletedOnboarding = true;
    },
    /** Store the phone number during OTP login flow */
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    /** Store the OTP request ID from server */
    setOtpRequestId: (state, action: PayloadAction<string>) => {
      state.otpRequestId = action.payload;
    },
    /** Mark whether verified phone is a new user */
    setIsNewUser: (state, action: PayloadAction<boolean>) => {
      state.isNewUser = action.payload;
    },
    /** Store the temporary registration token after OTP verify */
    setRegistrationToken: (state, action: PayloadAction<string | null>) => {
      state.registrationToken = action.payload;
    },
    /** Clear OTP flow state (e.g. when going back) */
    clearOtpFlow: (state) => {
      state.phone = null;
      state.otpRequestId = null;
      state.isNewUser = false;
      state.registrationToken = null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.phone = null;
      state.otpRequestId = null;
      state.isNewUser = false;
      state.registrationToken = null;
    },
  },
});

export const {
  setCredentials,
  updateUser,
  setTokens,
  setLoading,
  setBiometricEnabled,
  setOnboardingComplete,
  setPhone,
  setOtpRequestId,
  setIsNewUser,
  setRegistrationToken,
  clearOtpFlow,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
