/**
 * HINCH MART — Cart Stock & Inventory Verification Utilities
 * Amazon, Flipkart & Zepto standard logic for:
 * - Detecting out-of-stock cart items
 * - Guarding checkout and order placement
 * - Recommending and swapping in-stock alternatives
 */
import { CartItem } from '../types/cart.types';

/**
 * Checks if a cart item is currently out of stock.
 * Evaluates:
 * 1. Explicit isOutOfStock flag
 * 2. Active status: if product or item active is false, it's unavailable
 * 3. inStock status: if inStock is explicitly false
 * 4. Stock quantity: stockQty / stockQuantity <= 0
 * 5. Nested stock object: stock.isInStock === false or stock.available <= 0
 */
export function isCartItemOutOfStock(item: any): boolean {
  if (!item) return false;
  if (item.isOutOfStock === true) return true;

  const prod = item.product || item;

  // Inactive / unlisted product is treated as unavailable / out of stock
  if (prod.active === false || item.active === false) return true;

  // inStock boolean flag
  if (prod.inStock === false || item.inStock === false) return true;

  // Nested stock info
  if (prod.stock && typeof prod.stock === 'object') {
    if (prod.stock.isInStock === false) return true;
    if (typeof prod.stock.available === 'number' && prod.stock.available <= 0) return true;
  }

  // Direct stockQty / stockQuantity on product or cart item
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
 * Returns all out-of-stock items in the cart
 */
export function getOutOfStockItems(items: any[]): any[] {
  if (!Array.isArray(items)) return [];
  return items.filter(isCartItemOutOfStock);
}

/**
 * Returns all in-stock items in the cart
 */
export function getInStockItems(items: any[]): any[] {
  if (!Array.isArray(items)) return [];
  return items.filter((it) => !isCartItemOutOfStock(it));
}

/**
 * Returns true if the cart contains at least one out-of-stock item
 */
export function hasCartOutOfStockItems(items: any[]): boolean {
  return getOutOfStockItems(items).length > 0;
}
