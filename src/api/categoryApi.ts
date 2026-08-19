/**
 * HINCH MART — Category API
 * Connects category screens & filters with backend endpoints
 * Endpoints:
 * - GET /api/categories
 * - GET /api/categories/:id
 * - GET /api/categories/:id/products
 */
import { apiClient } from '../services/apiClient';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { Category, Product, SubCategory } from '../types/product.types';

export const categoryApi = {
  /**
   * Get all construction categories
   * GET /api/categories
   */
  getCategories: async () => {
    try {
      return await apiClient.get<ApiResponse<Category[]>>('/api/categories');
    } catch (err: any) {
      if (err.statusCode === 404) {
        return await apiClient.get<ApiResponse<Category[]>>('/categories');
      }
      throw err;
    }
  },

  /**
   * Get category details by ID or slug
   * GET /api/categories/:id
   */
  getCategoryDetail: async (id: string) => {
    try {
      return await apiClient.get<ApiResponse<Category>>(`/api/categories/${id}`);
    } catch (err: any) {
      if (err.statusCode === 404) {
        return await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
      }
      throw err;
    }
  },

  /**
   * Get products belonging to a specific category
   * GET /api/categories/:id/products
   */
  getCategoryProducts: async (
    id: string,
    params?: { page?: number; limit?: number; subCategory?: string; sort?: string }
  ) => {
    try {
      return await apiClient.get<PaginatedResponse<Product>>(`/api/categories/${id}/products`, {
        params,
      });
    } catch (err: any) {
      if (err.statusCode === 404) {
        return await apiClient.get<PaginatedResponse<Product>>(`/categories/${id}/products`, {
          params,
        });
      }
      throw err;
    }
  },

  /**
   * Get subcategories for a category
   * GET /api/categories/:id/subcategories
   */
  getSubcategories: async (id: string) => {
    return apiClient.get<ApiResponse<SubCategory[]>>(`/api/categories/${id}/subcategories`);
  },
};

export default categoryApi;
