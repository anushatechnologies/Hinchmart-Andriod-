/**
 * HINCH MART — Centralized API Client (Axios)
 * Handles request token injection, response error normalization, automatic token refresh, and network recovery.
 */
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../constants/api';
import { STORAGE_KEYS } from '../constants/app';
import { mmkvStorage } from './storage/mmkv';
import { tokenService } from './tokenService';
import { ApiError, TokenPair } from '../types/api.types';

// Event emitter for global state changes
type AuthEventHandler = () => void;
let onSessionExpired: AuthEventHandler | null = null;
let onNetworkError: AuthEventHandler | null = null;

export function setAuthEventHandlers(handlers: {
  onSessionExpired?: AuthEventHandler;
  onNetworkError?: AuthEventHandler;
}) {
  onSessionExpired = handlers.onSessionExpired ?? null;
  onNetworkError = handlers.onNetworkError ?? null;
}

// Track refresh token state to prevent concurrent refreshes
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError | any) => void;
}> = [];

function processQueue(error: AxiosError | any | null, token: string | null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
}

/**
 * Create the main API client instance
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request interceptor — inject auth token
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenService.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add language & currency headers
    const language = mmkvStorage.getString(STORAGE_KEYS.LANGUAGE) ?? 'en';
    const currency = mmkvStorage.getString(STORAGE_KEYS.CURRENCY) ?? 'USD';
    if (config.headers) {
      config.headers['Accept-Language'] = language;
      config.headers['X-Currency'] = currency;
    }

    if (__DEV__) {
      console.log(`[API Client] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor — handle 401 + refresh token
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Network error
    if (!error.response) {
      onNetworkError?.();
      return Promise.reject({
        success: false,
        message: 'Network error. Please check your internet connection or server status.',
        statusCode: 0,
      } as ApiError);
    }

    // 401 Unauthorized — attempt token refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshResponse = await axios.post<{ data: TokenPair }>(
          `${API_BASE_URL}/api/auth/refresh-token`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
        await tokenService.setTokens({ accessToken, refreshToken: newRefreshToken });

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await tokenService.clearAll();
        onSessionExpired?.();

        return Promise.reject({
          success: false,
          message: 'Session expired. Please login again.',
          statusCode: 401,
        } as ApiError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalized error response
    const apiError: ApiError = {
      success: false,
      message: error.response?.data?.message ?? error.message ?? 'An unexpected error occurred',
      statusCode: error.response?.status ?? 500,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;
