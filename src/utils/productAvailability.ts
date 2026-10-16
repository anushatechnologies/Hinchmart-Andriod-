/**
 * HINCH MART — Product Availability & Stock Decision Engine
 * Implements authoritative customer availability logic per Backend Handoff Contract:
 * - availableQty: Units customer can buy now
 * - inStock: true only if available, active, approved, and checkout enabled
 * - availabilityReason:
 *     • null -> In stock
 *     • UNAVAILABLE_NO_VENDOR_STOCK -> "Currently unavailable"
 *     • CHECKOUT_DISABLED -> "Temporarily unavailable"
 *     • OUT_OF_STOCK -> "Out of stock"
 *     • PRODUCT_INACTIVE -> "No longer available"
 * - Raw reason codes are never displayed directly to customers.
 */

export interface ProductAvailability {
  isInStock: boolean;
  availableQty: number;
  badgeText: string;
  badgeVariant: 'in_stock' | 'low_stock' | 'out_of_stock' | 'disabled';
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  canAddToCart: boolean;
  reasonCode: string | null;
  friendlyReason: string;
}

/**
 * Returns human-friendly text for any backend availability reason code
 */
export function getFriendlyAvailabilityReason(reasonCode?: string | null): string {
  if (!reasonCode) return 'In stock';
  const clean = String(reasonCode).trim().toUpperCase();

  switch (clean) {
    case 'UNAVAILABLE_NO_VENDOR_STOCK':
      return 'Currently unavailable';
    case 'CHECKOUT_DISABLED':
      return 'Temporarily unavailable';
    case 'PRODUCT_INACTIVE':
      return 'No longer available';
    case 'INSUFFICIENT_STOCK':
      return 'Insufficient stock';
    case 'OUT_OF_STOCK':
    default:
      return 'Out of stock';
  }
}

/**
 * Parses and computes the authoritative availability state for any product
 */
export function getProductAvailability(
  product?: any,
  lowStockThreshold: number = 5
): ProductAvailability {
  if (!product) {
    return {
      isInStock: false,
      availableQty: 0,
      badgeText: 'Currently unavailable',
      badgeVariant: 'out_of_stock',
      badgeColor: '#DC2626',
      badgeBg: '#FEE2E2',
      badgeBorder: '#FECACA',
      canAddToCart: false,
      reasonCode: 'OUT_OF_STOCK',
      friendlyReason: 'Currently unavailable',
    };
  }

  // 1. Resolve raw stock and available quantity
  const hasAvailableProp =
    product.availableQty !== undefined ||
    product.availableQuantity !== undefined ||
    product.available_qty !== undefined;
  const hasStockProp =
    product.stockQty !== undefined ||
    product.stock !== undefined ||
    product.stockQuantity !== undefined;

  const rawAvailable = product.availableQty ?? product.availableQuantity ?? product.available_qty;
  const rawStock = product.stockQty ?? product.stock ?? product.stockQuantity;
  const parsedAvailable = typeof rawAvailable === 'number' ? rawAvailable : parseInt(String(rawAvailable), 10);
  const parsedStock = typeof rawStock === 'number' ? rawStock : parseInt(String(rawStock), 10);

  let availableQty: number;
  if (hasAvailableProp && !isNaN(parsedAvailable)) {
    availableQty = Math.max(0, parsedAvailable);
  } else if (hasStockProp && !isNaN(parsedStock)) {
    availableQty = Math.max(0, parsedStock);
  } else {
    // If no stock properties are specified on the product object, treat as unconstrained
    availableQty = 999;
  }

  // 2. Resolve reason code
  const reasonCode =
    product.availabilityReason ||
    product.reason ||
    (product.product as any)?.availabilityReason ||
    null;

  // 3. Resolve authoritative inStock boolean
  let isInStock: boolean;
  if (reasonCode && reasonCode !== 'IN_STOCK') {
    isInStock = false;
  } else if (product.active === false || product.isActive === false) {
    isInStock = false;
  } else if (hasAvailableProp || hasStockProp) {
    if (availableQty <= 0) {
      isInStock = false;
    } else {
      // 4. MOQ (Minimum Order Quantity) check: if available inventory cannot fulfill supplier MOQ
      const rawMoq = product.moq ?? product.minimumOrderQuantity ?? product.minOrderQty;
      const parsedMoq = typeof rawMoq === 'number' ? rawMoq : parseInt(String(rawMoq || 1), 10);
      const moq = !isNaN(parsedMoq) && parsedMoq > 0 ? parsedMoq : 1;

      if (moq > 1 && availableQty < moq) {
        const friendlyReason = `Minimum order quantity (${moq}) not available in stock`;
        return {
          isInStock: false,
          availableQty,
          badgeText: 'Temporarily unavailable',
          badgeVariant: 'out_of_stock',
          badgeColor: '#DC2626',
          badgeBg: '#FEE2E2',
          badgeBorder: '#FECACA',
          canAddToCart: false,
          reasonCode: 'INSUFFICIENT_STOCK',
          friendlyReason,
        };
      }

      if (typeof product.inStock === 'boolean') {
        isInStock = product.inStock;
      } else if (typeof (product.product as any)?.inStock === 'boolean') {
        isInStock = (product.product as any).inStock;
      } else {
        isInStock = true;
      }
    }
  } else if (typeof product.inStock === 'boolean') {
    isInStock = product.inStock;
  } else {
    isInStock = true;
  }

  // 5. Generate customer-facing badge text and styling
  if (isInStock) {
    if (availableQty > 0 && availableQty <= lowStockThreshold) {
      return {
        isInStock: true,
        availableQty,
        badgeText: `Only ${availableQty} left in stock`,
        badgeVariant: 'low_stock',
        badgeColor: '#D97706',
        badgeBg: '#FEF3C7',
        badgeBorder: '#FDE68A',
        canAddToCart: true,
        reasonCode: null,
        friendlyReason: 'In stock',
      };
    }

    return {
      isInStock: true,
      availableQty,
      badgeText: 'In Stock',
      badgeVariant: 'in_stock',
      badgeColor: '#059669',
      badgeBg: '#DCFCE7',
      badgeBorder: '#BBF7D0',
      canAddToCart: true,
      reasonCode: null,
      friendlyReason: 'In stock',
    };
  }

  // Out of stock branch
  const friendlyReason = getFriendlyAvailabilityReason(reasonCode);
  return {
    isInStock: false,
    availableQty: 0,
    badgeText: friendlyReason,
    badgeVariant: 'out_of_stock',
    badgeColor: '#DC2626',
    badgeBg: '#FEE2E2',
    badgeBorder: '#FECACA',
    canAddToCart: false,
    reasonCode: reasonCode || 'OUT_OF_STOCK',
    friendlyReason,
  };
}
