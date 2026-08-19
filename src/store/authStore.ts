/**
 * HINCH MART — Authentication Store
 * Phone Number + OTP flow. No password authentication.
 * Handles: session restore on startup, saving tokens, logout.
 */
import { store } from '../redux/store';
import { setCredentials, logout as reduxLogout, updateUser } from '../redux/slices/authSlice';
import { authApi } from '../api/authApi';
import { tokenService } from '../services/tokenService';
import { User } from '../types/auth.types';

export const authStore = {
  /**
   * Initialize auth state from secure persistent storage on app startup.
   * Called from App.tsx once on mount.
   * Valid token → restores session → SplashScreen navigates to MainTabs
   * No token  → SplashScreen navigates to Login
   */
  init: async () => {
    try {
      const accessToken = tokenService.getAccessToken();
      const refreshToken = tokenService.getRefreshToken();
      const user = tokenService.getUser();

      if (accessToken && user) {
        store.dispatch(
          setCredentials({
            user,
            accessToken,
            refreshToken: refreshToken || '',
          })
        );

        // Refresh user profile silently in background
        try {
          const profileRes = await authApi.getMe();
          if (profileRes?.data?.data) {
            const freshUser = profileRes.data.data;
            await tokenService.setUser(freshUser);
            store.dispatch(updateUser(freshUser));
          }
        } catch {
          // Token still valid; background profile refresh is optional
        }
      }
    } catch (e) {
      console.warn('[AuthStore] Initialization failed:', e);
    }
  },

  /**
   * Persist authenticated session after OTP verification or registration.
   * Called from OTPScreen (existing user) or RegistrationDetailsScreen (new user).
   */
  saveSession: async (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => {
    await tokenService.setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    await tokenService.setUser(data.user);
    store.dispatch(
      setCredentials({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
    );
  },

  /**
   * Fetch fresh user profile from backend
   */
  fetchCurrentUser: async (): Promise<User | null> => {
    try {
      const res = await authApi.getMe();
      if (res?.data?.data) {
        const user = res.data.data;
        await tokenService.setUser(user);
        store.dispatch(updateUser(user));
        return user;
      }
      return null;
    } catch (error) {
      console.warn('[AuthStore] Error fetching current user:', error);
      return null;
    }
  },

  /**
   * Logout — clears tokens from device and Redux state
   */
  logout: async (): Promise<void> => {
    try {
      await authApi.logout().catch(() => {});
    } finally {
      await tokenService.clearAll();
      store.dispatch(reduxLogout());
    }
  },

  /**
   * Get current auth state snapshot
   */
  getState: () => store.getState().auth,
};

export default authStore;
