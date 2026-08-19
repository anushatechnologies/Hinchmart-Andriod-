/**
 * HINCH MART — Request for Quotation (RFQ) API
 * Connects B2B procurement workflows with backend RFQ service
 * Endpoints:
 * - POST /api/rfqs
 * - GET  /api/rfqs
 * - GET  /api/rfqs/:id
 * - GET  /api/rfqs/:id/quotations
 */
import { apiClient } from '../services/apiClient';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types/api.types';
import { RFQ, Quotation, CreateRFQRequest } from '../types/rfq.types';

export interface MobileCreateRFQPayload {
  productMaterial: string;
  quantity: number | string;
  unit: string;
  deliveryLocation: string;
  requiredByDate: string;
  targetPrice?: number | string;
  specifications: string;
  preferredVendors?: string[];
  notes?: string;
  title?: string;
  description?: string;
  deadline?: string;
  items?: Array<{
    name: string;
    quantity: number;
    unit: string;
    specifications: string;
    preferredBrands?: string[];
  }>;
}

export const rfqApi = {
  /**
   * Submit new RFQ request
   * POST /api/rfqs
   */
  createRFQ: async (data: MobileCreateRFQPayload | CreateRFQRequest) => {
    // Normalize payload to match backend schema
    const payload = {
      title: (data as any).title || (data as any).productMaterial || 'Material Sourcing RFQ',
      description:
        (data as any).description ||
        `Material: ${(data as any).productMaterial || ''}\nLocation: ${(data as any).deliveryLocation || ''}\nTarget Price: ${(data as any).targetPrice || 'N/A'}\nSpecs: ${(data as any).specifications || ''}`,
      deadline: (data as any).deadline || (data as any).requiredByDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      items: (data as any).items || [
        {
          name: (data as any).productMaterial || 'Construction Material',
          description: (data as any).specifications || '',
          quantity: Number((data as any).quantity) || 1,
          unit: (data as any).unit || 'Units',
          specifications: (data as any).specifications || '',
          preferredBrands: [],
        },
      ],
      productMaterial: (data as any).productMaterial,
      quantity: (data as any).quantity,
      unit: (data as any).unit,
      deliveryLocation: (data as any).deliveryLocation,
      requiredByDate: (data as any).requiredByDate,
      targetPrice: (data as any).targetPrice,
      specifications: (data as any).specifications,
      preferredVendors: data.preferredVendors || [],
      notes: data.notes || '',
    };

    try {
      return await apiClient.post<ApiResponse<RFQ>>('/api/rfqs', payload);
    } catch (err: any) {
      if (err.statusCode === 404) {
        return await apiClient.post<ApiResponse<RFQ>>('/rfq', payload);
      }
      throw err;
    }
  },

  /**
   * Get user's RFQs list
   * GET /api/rfqs  (falls back to /api/rfqs/my if backend uses that route)
   */
  getRFQs: async (params?: PaginationParams & { status?: string }) => {
    try {
      return await apiClient.get<PaginatedResponse<RFQ>>('/api/rfqs', { params });
    } catch (err: any) {
      if (err.statusCode === 404) {
        // Member 2 backend may use /api/rfqs/my instead of /api/rfqs
        try {
          return await apiClient.get<PaginatedResponse<RFQ>>('/api/rfqs/my', { params });
        } catch {
          return await apiClient.get<PaginatedResponse<RFQ>>('/rfq', { params });
        }
      }
      throw err;
    }
  },

  /**
   * Get RFQ details by ID
   * GET /api/rfqs/:id
   */
  getRFQDetail: async (id: string) => {
    try {
      return await apiClient.get<ApiResponse<RFQ>>(`/api/rfqs/${id}`);
    } catch (err: any) {
      if (err.statusCode === 404) {
        return await apiClient.get<ApiResponse<RFQ>>(`/rfq/${id}`);
      }
      throw err;
    }
  },

  /**
   * Get quotations submitted by suppliers for an RFQ
   * GET /api/rfqs/:id/quotations
   */
  getQuotations: async (rfqId: string) => {
    try {
      return await apiClient.get<ApiResponse<Quotation[]>>(`/api/rfqs/${rfqId}/quotations`);
    } catch (err: any) {
      if (err.statusCode === 404) {
        return await apiClient.get<ApiResponse<Quotation[]>>(`/rfq/${rfqId}/quotations`);
      }
      throw err;
    }
  },

  /**
   * Approve a vendor quotation
   * POST /api/rfqs/:id/quotations/:quotationId/approve
   */
  approveQuotation: async (rfqId: string, quotationId: string) => {
    return apiClient.post<ApiResponse<null>>(`/api/rfqs/${rfqId}/quotations/${quotationId}/approve`);
  },

  /**
   * Reject a vendor quotation
   * POST /api/rfqs/:id/quotations/:quotationId/reject
   */
  rejectQuotation: async (rfqId: string, quotationId: string, reason: string) => {
    return apiClient.post<ApiResponse<null>>(`/api/rfqs/${rfqId}/quotations/${quotationId}/reject`, {
      reason,
    });
  },
};

export default rfqApi;
