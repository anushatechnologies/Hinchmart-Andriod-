/**
 * HINCH MART — Cart Store
 * Unified cart manager that synchronizes state with Redux and offline storage
 */
import { store } from '../redux/store';
import {
  addItem as reduxAddItem,
  updateItemQuantity,
  removeItem as reduxRemoveItem,
  clearCart as reduxClearCart,
  setCoupon,
  removeCoupon as reduxRemoveCoupon,
  setUseWallet,
  hideCartToast,
} from '../redux/slices/cartSlice';
import { CartItem } from '../types/cart.types';
import { Product } from '../types/product.types';

export const cartStore = {
  /**
   * Add a product to cart
   */
  addItem: (product: Product, quantity = 1, variantId: string | null = null, variant: any = null) => {
    const unitPrice = product.price?.amount ?? (product.price as any) ?? 0;
    const cartItem: CartItem = {
      id: `${product.id}_${variantId || 'default'}_${Date.now()}`,
      productId: product.id,
      product,
      variantId,
      variant,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };
    store.dispatch(reduxAddItem(cartItem));
    return cartItem;
  },

  /**
   * Update item quantity
   */
  updateQuantity: (id: string, quantity: number) => {
    if (quantity <= 0) {
      store.dispatch(reduxRemoveItem(id));
    } else {
      store.dispatch(updateItemQuantity({ id, quantity }));
    }
  },

  /**
   * Remove item from cart
   */
  removeItem: (id: string) => {
    store.dispatch(reduxRemoveItem(id));
  },

  /**
   * Clear all items from cart
   */
  clearCart: () => {
    store.dispatch(reduxClearCart());
  },

  /**
   * Apply coupon code and discount
   */
  applyCoupon: (code: string, discount: number) => {
    store.dispatch(setCoupon({ code, discount }));
  },

  /**
   * Remove applied coupon
   */
  removeCoupon: () => {
    store.dispatch(reduxRemoveCoupon());
  },

  /**
   * Toggle business wallet credit usage
   */
  setUseWallet: (use: boolean) => {
    store.dispatch(setUseWallet(use));
  },

  /**
   * Hide the floating toast popup
   */
  dismissToast: () => {
    store.dispatch(hideCartToast());
  },

  /**
   * Get current items
   */
  getItems: (): CartItem[] => store.getState().cart.items,

  /**
   * Get total item count
   */
  getItemCount: (): number =>
    store.getState().cart.items.reduce((acc, item) => acc + item.quantity, 0),

  /**
   * Calculate subtotal
   */
  getSubtotal: (): number =>
    store.getState().cart.items.reduce((acc, item) => acc + item.totalPrice, 0),

  /**
   * Get current cart snapshot
   */
  getState: () => store.getState().cart,
};

export default cartStore;
