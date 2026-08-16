/**
 * HINCH MART — RFQ API Service
 */
import apiClient from './client';
import { API_ENDPOINTS } from '../../constants/api';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../../types/api.types';
import { RFQ, Quotation, CreateRFQRequest } from '../../types/rfq.types';

export const rfqApi = {
  getRFQs: (params: PaginationParams & { status?: string }) =>
    apiClient.get<PaginatedResponse<RFQ>>(API_ENDPOINTS.RFQ.LIST, { params }),

  createRFQ: (data: CreateRFQRequest) =>
    apiClient.post<ApiResponse<RFQ>>(API_ENDPOINTS.RFQ.CREATE, data),

  getRFQDetail: (id: string) =>
    apiClient.get<ApiResponse<RFQ>>(API_ENDPOINTS.RFQ.DETAIL(id)),

  getQuotations: (rfqId: string) =>
    apiClient.get<ApiResponse<Quotation[]>>(API_ENDPOINTS.RFQ.QUOTATIONS(rfqId)),

  approveQuotation: (rfqId: string, quotationId: string) =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.RFQ.APPROVE(rfqId, quotationId)),

  rejectQuotation: (rfqId: string, quotationId: string, reason: string) =>
    apiClient.post<ApiResponse<null>>(API_ENDPOINTS.RFQ.REJECT(rfqId, quotationId), { reason }),
};
