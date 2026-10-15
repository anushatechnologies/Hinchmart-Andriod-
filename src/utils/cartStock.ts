/**
 * HINCH MART — Cart Stock & Inventory Verification Utilities
 * Amazon, Flipkart & Zepto standard logic for:
 * - Detecting out-of-stock and unavailable cart items
 * - Guarding checkout and order placement
 * - Recommending and swapping in-stock alternatives
 */
import { CartItem } from '../types/cart.types';
import { getProductAvailability, getFriendlyAvailabilityReason } from './productAvailability';

/**
 * Checks if a cart item is currently out of stock or unavailable for checkout.
 * Evaluates:
 * 1. Explicit isOutOfStock flag
 * 2. Explicit reason from server (UNAVAILABLE_NO_VENDOR_STOCK, CHECKOUT_DISABLED, etc.)
 * 3. inStock status: if inStock is explicitly false
 * 4. Active status: if product or item active is false, it's unavailable
 * 5. Available quantity: availableQty <= 0 or item.quantity > availableQty
 * 6. Nested stock object: stock.isInStock === false or stock.available <= 0
 * 7. Legacy stockQty <= 0
 */
export function isCartItemOutOfStock(item: any): boolean {
  if (!item) return false;
  if (item.isOutOfStock === true) return true;

  const prod = item.product || item;

  // 1. Explicit reason from server (e.g. UNAVAILABLE_NO_VENDOR_STOCK, CHECKOUT_DISABLED)
  const reason = item.reason || item.availabilityReason || prod.availabilityReason;
  if (reason && reason !== 'IN_STOCK') return true;

  // 2. inStock boolean flag
  if (item.inStock === false || prod.inStock === false) return true;

  // 3. Inactive / unlisted product is treated as unavailable
  if (prod.active === false || item.active === false) return true;

  // 4. Available quantity check
  const rawAvail =
    item.availableQty ??
    item.availableQuantity ??
    prod.availableQty ??
    prod.availableQuantity;
  if (rawAvail !== undefined && rawAvail !== null) {
    const parsed = typeof rawAvail === 'number' ? rawAvail : parseInt(String(rawAvail), 10);
    if (!isNaN(parsed) && parsed <= 0) return true;
    // Quantity in cart exceeds available inventory
    if (!isNaN(parsed) && parsed > 0 && typeof item.quantity === 'number' && item.quantity > parsed) {
      return true;
    }
  }

  // 5. Nested stock info
  if (prod.stock && typeof prod.stock === 'object') {
    if (prod.stock.isInStock === false) return true;
    if (typeof prod.stock.available === 'number' && prod.stock.available <= 0) return true;
  }

  // 6. Direct stockQty / stockQuantity on product or cart item (legacy fallback)
  const rawStock =
    prod.stockQty ??
    prod.stockQuantity ??
    (typeof prod.stock === 'number' ? prod.stock : undefined) ??
    item.stockQty ??
    item.stockQuantity;

  if (rawStock !== undefined && rawStock !== null) {
    const parsed = typeof rawStock === 'number' ? rawStock : parseInt(String(rawStock), 10);
    if (!isNaN(parsed) && parsed <= 0) {
      return true;
    }
  }

  return false;
}

/**
 * Returns human-friendly unavailability reason for a cart item
 */
export function getCartItemUnavailableReason(item: any): string {
  if (!item) return 'Out of stock';
  const prod = item.product || item;
  const reason = item.reason || item.availabilityReason || prod.availabilityReason;
  if (reason) {
    return getFriendlyAvailabilityReason(reason);
  }
  const rawAvail =
    item.availableQty ??
    item.availableQuantity ??
    prod.availableQty ??
    prod.availableQuantity;
  if (rawAvail !== undefined && rawAvail !== null) {
    const parsed = typeof rawAvail === 'number' ? rawAvail : parseInt(String(rawAvail), 10);
    if (!isNaN(parsed) && parsed <= 0) {
      return 'Out of stock';
    }
    if (!isNaN(parsed) && parsed > 0 && typeof item.quantity === 'number' && item.quantity > parsed) {
      return `Only ${parsed} available in stock`;
    }
  }
  if (item.active === false || prod.active === false) {
    return 'No longer available';
  }
  return 'Currently unavailable';
}

/**
 * Returns all out-of-stock or blocked items in the cart
 */
export function getOutOfStockItems(items: any[]): any[] {
  if (!Array.isArray(items)) return [];
  return items.filter(isCartItemOutOfStock);
}

/**
 * Returns all in-stock and purchasable items in the cart
 */
export function getInStockItems(items: any[]): any[] {
  if (!Array.isArray(items)) return [];
  return items.filter((it) => !isCartItemOutOfStock(it));
}

/**
 * Returns true if the cart contains at least one out-of-stock or blocked item
 */
export function hasCartOutOfStockItems(items: any[]): boolean {
  return getOutOfStockItems(items).length > 0;
}
