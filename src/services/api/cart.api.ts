/**
 * HINCH MART — Cart API Service
 */
import apiClient from './client';
import { API_ENDPOINTS } from '../../constants/api';
import { ApiResponse } from '../../types/api.types';
import { CartItem, CartState, CouponValidation, AddToCartRequest, UpdateCartItemRequest } from '../../types/cart.types';

export const cartApi = {
  getCart: () =>
    apiClient.get<ApiResponse<CartState>>(API_ENDPOINTS.CART.GET),

  addToCart: (data: AddToCartRequest) =>
    apiClient.post<ApiResponse<CartItem>>(API_ENDPOINTS.CART.ADD, data),

  updateCartItem: ({ cartItemId, quantity }: UpdateCartItemRequest) =>
    apiClient.put<ApiResponse<CartItem>>(API_ENDPOINTS.CART.UPDATE(cartItemId), { quantity }),

  removeCartItem: (cartItemId: string) =>
    apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.CART.REMOVE(cartItemId)),

  clearCart: () =>
    apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.CART.CLEAR),

  applyCoupon: (code: string) =>
    apiClient.post<ApiResponse<CouponValidation>>(API_ENDPOINTS.CART.APPLY_COUPON, { code }),

  removeCoupon: () =>
    apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.CART.REMOVE_COUPON),

  getDeliveryEstimate: (addressId: string) =>
    apiClient.get<ApiResponse<{ estimate: string; cost: number }>>(
      API_ENDPOINTS.CART.DELIVERY_ESTIMATE,
      { params: { addressId } }
    ),
};
