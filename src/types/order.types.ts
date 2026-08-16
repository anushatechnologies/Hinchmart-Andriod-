/**
 * HINCH MART — Order Types
 */

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
export type PaymentMethod = 'card' | 'upi' | 'net_banking' | 'wallet' | 'cod' | 'bank_transfer';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  walletUsed: number;
  total: number;
  currency: string;
  couponCode: string | null;
  tracking: TrackingInfo | null;
  timeline: OrderTimeline[];
  notes: string;
  invoice: InvoiceInfo | null;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantId: string | null;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sku: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  currentStatus: string;
  currentLocation: string;
  estimatedDelivery: string;
  updates: TrackingUpdate[];
}

export interface TrackingUpdate {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface InvoiceInfo {
  id: string;
  invoiceNumber: string;
  url: string;
  generatedAt: string;
}

export interface ReturnRequest {
  orderId: string;
  itemIds: string[];
  reason: string;
  description: string;
  images: string[];
  refundMethod: 'original' | 'wallet';
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
  cost: number;
  isFree: boolean;
  icon: string;
}
