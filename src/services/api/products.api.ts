/**
 * HINCH MART — Products API Service
 */
import apiClient from './client';
import { API_ENDPOINTS } from '../../constants/api';
import { ApiResponse, PaginatedResponse, SearchParams } from '../../types/api.types';
import { Product, Category, Review, Brand } from '../../types/product.types';

export const productsApi = {
  getCategories: () =>
    apiClient.get<ApiResponse<Category[]>>(API_ENDPOINTS.CATEGORIES.LIST),

  getCategoryDetail: (id: string) =>
    apiClient.get<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.DETAIL(id)),

  getProducts: (params: SearchParams) =>
    apiClient.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS.LIST, { params }),

  getProductDetail: (id: string) =>
    apiClient.get<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.DETAIL(id)),

  getProductReviews: (id: string, params: { page: number; limit: number }) =>
    apiClient.get<PaginatedResponse<Review>>(API_ENDPOINTS.PRODUCTS.REVIEWS(id), { params }),

  writeReview: (id: string, data: { rating: number; title: string; comment: string; images?: string[] }) =>
    apiClient.post<ApiResponse<Review>>(API_ENDPOINTS.PRODUCTS.REVIEWS(id), data),

  getRelatedProducts: (id: string) =>
    apiClient.get<ApiResponse<Product[]>>(API_ENDPOINTS.PRODUCTS.RELATED(id)),

  searchProducts: (params: SearchParams) =>
    apiClient.get<PaginatedResponse<Product>>(API_ENDPOINTS.SEARCH.PRODUCTS, { params }),

  getSearchSuggestions: (query: string) =>
    apiClient.get<ApiResponse<string[]>>(API_ENDPOINTS.SEARCH.SUGGESTIONS, { params: { q: query } }),

  // Home data
  getBanners: () =>
    apiClient.get<ApiResponse<Array<{ id: string; image: string; title: string; subtitle: string; action: string }>>>(
      API_ENDPOINTS.HOME.BANNERS
    ),

  getFeaturedProducts: () =>
    apiClient.get<ApiResponse<Product[]>>(API_ENDPOINTS.HOME.FEATURED),

  getDeals: () =>
    apiClient.get<ApiResponse<Product[]>>(API_ENDPOINTS.HOME.DEALS),

  getTrending: () =>
    apiClient.get<ApiResponse<Product[]>>(API_ENDPOINTS.HOME.TRENDING),

  getBrands: () =>
    apiClient.get<ApiResponse<Brand[]>>(API_ENDPOINTS.HOME.BRANDS),

  getRecentlyViewed: () =>
    apiClient.get<ApiResponse<Product[]>>(API_ENDPOINTS.HOME.RECENTLY_VIEWED),

  getRecommended: () =>
    apiClient.get<ApiResponse<Product[]>>(API_ENDPOINTS.HOME.RECOMMENDED),
};
