/**
 * HINCH MART — RFQ Types
 */

export type RFQStatus = 'draft' | 'submitted' | 'in_review' | 'quoted' | 'approved' | 'rejected' | 'expired' | 'completed';

export interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  description: string;
  items: RFQItem[];
  attachments: RFQAttachment[];
  status: RFQStatus;
  deadline: string;
  preferredVendors: string[];
  quotations: Quotation[];
  approvedQuotationId: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface RFQItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  specifications: string;
  preferredBrands: string[];
}

export interface RFQAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Quotation {
  id: string;
  rfqId: string;
  vendorId: string;
  vendorName: string;
  vendorLogo: string;
  vendorRating: number;
  items: QuotationItem[];
  totalAmount: number;
  currency: string;
  validUntil: string;
  deliveryDays: number;
  paymentTerms: string;
  notes: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
}

export interface QuotationItem {
  rfqItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  brand: string;
  remarks: string;
}

export interface CreateRFQRequest {
  title: string;
  description: string;
  items: Omit<RFQItem, 'id'>[];
  deadline: string;
  preferredVendors?: string[];
  notes?: string;
}
