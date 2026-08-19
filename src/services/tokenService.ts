/**
 * HINCH MART — Token & Secure Authentication Service
 * Manages storage and retrieval of JWT tokens and authenticated user data.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/app';
import { mmkvStorage } from './storage/mmkv';
import { TokenPair } from '../types/api.types';
import { User } from '../types/auth.types';

export const tokenService = {
  /**
   * Get current JWT access token
   */
  getAccessToken: (): string | null => {
    try {
      const token = mmkvStorage.getString(STORAGE_KEYS.ACCESS_TOKEN);
      return token || null;
    } catch {
      return null;
    }
  },

  /**
   * Get access token asynchronously (checks AsyncStorage fallback)
   */
  getAccessTokenAsync: async (): Promise<string | null> => {
    try {
      const token = mmkvStorage.getString(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) return token;
      return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch {
      return null;
    }
  },

  /**
   * Set JWT access token
   */
  setAccessToken: async (token: string): Promise<void> => {
    try {
      mmkvStorage.setString(STORAGE_KEYS.ACCESS_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    } catch (e) {
      console.warn('[TokenService] Error saving access token:', e);
    }
  },

  /**
   * Get refresh token
   */
  getRefreshToken: (): string | null => {
    try {
      const token = mmkvStorage.getString(STORAGE_KEYS.REFRESH_TOKEN);
      return token || null;
    } catch {
      return null;
    }
  },

  /**
   * Set refresh token
   */
  setRefreshToken: async (token: string): Promise<void> => {
    try {
      mmkvStorage.setString(STORAGE_KEYS.REFRESH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch (e) {
      console.warn('[TokenService] Error saving refresh token:', e);
    }
  },

  /**
   * Save both access and refresh tokens
   */
  setTokens: async (tokens: TokenPair | { accessToken: string; refreshToken?: string }): Promise<void> => {
    try {
      if (tokens.accessToken) {
        mmkvStorage.setString(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
        await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
      }
      if (tokens.refreshToken) {
        mmkvStorage.setString(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      }
    } catch (e) {
      console.warn('[TokenService] Error saving tokens:', e);
    }
  },

  /**
   * Save authenticated user profile
   */
  setUser: async (user: User | any): Promise<void> => {
    try {
      mmkvStorage.setObject(STORAGE_KEYS.USER, user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.warn('[TokenService] Error saving user:', e);
    }
  },

  /**
   * Get authenticated user profile
   */
  getUser: (): User | null => {
    try {
      const user = mmkvStorage.getObject<User>(STORAGE_KEYS.USER);
      return user || null;
    } catch {
      return null;
    }
  },

  /**
   * Get user asynchronously with fallback
   */
  getUserAsync: async (): Promise<User | null> => {
    try {
      const user = mmkvStorage.getObject<User>(STORAGE_KEYS.USER);
      if (user) return user;
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if access token is present
   */
  hasToken: (): boolean => {
    return !!tokenService.getAccessToken();
  },

  /**
   * Clear all auth tokens
   */
  clearTokens: async (): Promise<void> => {
    try {
      mmkvStorage.remove(STORAGE_KEYS.ACCESS_TOKEN);
      mmkvStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (e) {
      console.warn('[TokenService] Error clearing tokens:', e);
    }
  },

  /**
   * Clear all user session data
   */
  clearAll: async (): Promise<void> => {
    try {
      mmkvStorage.remove(STORAGE_KEYS.ACCESS_TOKEN);
      mmkvStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
      mmkvStorage.remove(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.warn('[TokenService] Error clearing session:', e);
    }
  },
};

export default tokenService;
