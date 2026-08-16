/**
 * HINCH MART — Orders API Service
 */
import apiClient from './client';
import { API_ENDPOINTS } from '../../constants/api';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../../types/api.types';
import { Order, ShippingMethod, ReturnRequest, TrackingInfo } from '../../types/order.types';

export const ordersApi = {
  getOrders: (params: PaginationParams & { status?: string }) =>
    apiClient.get<PaginatedResponse<Order>>(API_ENDPOINTS.ORDERS.LIST, { params }),

  getOrderDetail: (id: string) =>
    apiClient.get<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.DETAIL(id)),

  cancelOrder: (id: string, reason: string) =>
    apiClient.post<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.CANCEL(id), { reason }),

  returnOrder: (id: string, data: ReturnRequest) =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.ORDERS.RETURN(id), data),

  reorder: (id: string) =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.ORDERS.REORDER(id)),

  getTracking: (id: string) =>
    apiClient.get<ApiResponse<TrackingInfo>>(API_ENDPOINTS.ORDERS.TRACKING(id)),

  getInvoice: (id: string) =>
    apiClient.get<ApiResponse<{ url: string }>>(API_ENDPOINTS.ORDERS.INVOICE(id)),

  // Checkout
  getShippingMethods: (addressId: string) =>
    apiClient.get<ApiResponse<ShippingMethod[]>>(API_ENDPOINTS.CHECKOUT.SHIPPING_METHODS, {
      params: { addressId },
    }),

  placeOrder: (data: {
    addressId: string;
    shippingMethodId: string;
    paymentMethod: string;
    couponCode?: string;
    useWallet?: boolean;
    notes?: string;
  }) => apiClient.post<ApiResponse<Order>>(API_ENDPOINTS.CHECKOUT.PLACE_ORDER, data),

  verifyPayment: (data: { orderId: string; paymentId: string; signature: string }) =>
    apiClient.post<ApiResponse<Order>>(API_ENDPOINTS.CHECKOUT.VERIFY_PAYMENT, data),
};
