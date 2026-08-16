/**
 * HINCH MART — Cart Types
 */
import { Product, ProductVariant } from './product.types';

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId: string | null;
  variant: ProductVariant | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  walletBalance: number;
  useWallet: boolean;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
  deliveryEstimate: string | null;
}

export interface CouponValidation {
  isValid: boolean;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  maxDiscount: number;
  message: string;
}

export interface AddToCartRequest {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  cartItemId: string;
  quantity: number;
}
