/**
 * HINCH MART — Product API
 * Connects product listing, details, reviews, and advanced filter search
 * Endpoints:
 * - GET /api/products
 * - GET /api/products/:id
 * - GET /api/products/:id/reviews
 * - POST /api/products/:id/reviews
 * - GET /api/products/:id/related
 */
import { apiClient } from '../services/apiClient';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { Product, Review, Brand } from '../types/product.types';

export interface ProductFilterParams {
  category?: string;
  subCategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: 'in_stock' | 'out_of_stock' | boolean;
  seller?: string;
  vendorId?: string;
  search?: string;
  q?: string;
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
}

export const productApi = {
  /**
   * Get product list with comprehensive filters
   * GET /api/products
   */
  getProducts: async (params?: ProductFilterParams) => {
    try {
      return await apiClient.get<PaginatedResponse<Product>>('/api/products', {
        params,
      });
    } catch (err: any) {
      if (err.statusCode === 404) {
        return await apiClient.get<PaginatedResponse<Product>>('/products', {
          params,
        });
      }
      throw err;
    }
  },

  /**
   * Get product detail by ID or slug
   * GET /api/products/:id
   */
  getProductDetail: async (id: string) => {
    try {
      return await apiClient.get<ApiResponse<Product>>(`/api/products/${id}`);
    } catch (err: any) {
      if (err.statusCode === 404) {
        return await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
      }
      throw err;
    }
  },

  /**
   * Get product customer reviews
   * GET /api/products/:id/reviews
   */
  getProductReviews: async (id: string, params?: { page?: number; limit?: number }) => {
    return apiClient.get<PaginatedResponse<Review>>(`/api/products/${id}/reviews`, {
      params,
    });
  },

  /**
   * Submit product review
   * POST /api/products/:id/reviews
   */
  writeReview: async (
    id: string,
    data: { rating: number; title: string; comment: string; images?: string[] }
  ) => {
    return apiClient.post<ApiResponse<Review>>(`/api/products/${id}/reviews`, data);
  },

  /**
   * Get related/recommended products
   * GET /api/products/:id/related
   */
  getRelatedProducts: async (id: string) => {
    return apiClient.get<ApiResponse<Product[]>>(`/api/products/${id}/related`);
  },

  /**
   * Search suggestions autocomplete
   * GET /api/search/suggestions
   */
  getSuggestions: async (query: string) => {
    return apiClient.get<ApiResponse<string[]>>('/api/search/suggestions', {
      params: { q: query },
    });
  },

  /**
   * Get featured/deal products
   * GET /api/home/featured
   */
  getFeaturedProducts: async () => {
    try {
      return await apiClient.get<ApiResponse<Product[]>>('/api/home/featured');
    } catch (err: any) {
      if (err.statusCode === 404) {
        return await apiClient.get<ApiResponse<Product[]>>('/home/featured');
      }
      throw err;
    }
  },
};

export default productApi;
