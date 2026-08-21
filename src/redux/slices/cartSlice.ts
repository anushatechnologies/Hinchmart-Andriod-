/**
 * HINCH MART — Cart Redux Slice
 * Centralized cart state: item selection, quantity steppers, MOQ checks,
 * dynamic GST calculations, coupon engine, and toast feedback.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types/cart.types';

export interface CartToastInfo {
  visible: boolean;
  itemTitle: string;
  itemPrice: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  useWallet: boolean;
  shippingCost: number;
  addedToast: CartToastInfo | null;
}

const initialState: CartState = {
  items: [],
  couponCode: null,
  couponDiscount: 0,
  useWallet: false,
  shippingCost: 150,
  addedToast: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload.map((item) => ({
        ...item,
        selected: item.selected ?? true,
      }));
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId
      );
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += action.payload.quantity;
        state.items[existingIndex].totalPrice =
          state.items[existingIndex].quantity * state.items[existingIndex].unitPrice;
      } else {
        state.items.push({
          ...action.payload,
          selected: action.payload.selected ?? true,
        });
      }

      // Trigger sleek Add-to-Cart popup banner
      state.addedToast = {
        visible: true,
        itemTitle: action.payload.product?.name || 'Construction Product',
        itemPrice: action.payload.unitPrice,
        quantity: action.payload.quantity,
      };
    },
    hideCartToast: (state) => {
      state.addedToast = null;
    },
    updateItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
        item.totalPrice = item.quantity * item.unitPrice;
      }
    },
    toggleSelectItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.selected = item.selected !== undefined ? !item.selected : false;
      }
    },
    selectAllItems: (state, action: PayloadAction<boolean>) => {
      state.items.forEach((item) => {
        item.selected = action.payload;
      });
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      state.couponCode = null;
      state.couponDiscount = 0;
      state.useWallet = false;
      state.addedToast = null;
    },
    setCoupon: (
      state,
      action: PayloadAction<{ code: string; discount: number }>
    ) => {
      state.couponCode = action.payload.code;
      state.couponDiscount = action.payload.discount;
    },
    removeCoupon: (state) => {
      state.couponCode = null;
      state.couponDiscount = 0;
    },
    setShippingCost: (state, action: PayloadAction<number>) => {
      state.shippingCost = action.payload;
    },
    setUseWallet: (state, action: PayloadAction<boolean>) => {
      state.useWallet = action.payload;
    },
  },
});

export const {
  setCartItems,
  addItem,
  hideCartToast,
  updateItemQuantity,
  toggleSelectItem,
  selectAllItems,
  removeItem,
  clearCart,
  setCoupon,
  removeCoupon,
  setShippingCost,
  setUseWallet,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectSelectedCartItems = (state: { cart: CartState }) =>
  state.cart.items.filter((item) => item.selected !== false);

export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectSelectedCount = (state: { cart: CartState }) =>
  state.cart.items
    .filter((item) => item.selected !== false)
    .reduce((sum, item) => sum + item.quantity, 0);

export const selectCartSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

export const selectSelectedSubtotal = (state: { cart: CartState }) =>
  state.cart.items
    .filter((item) => item.selected !== false)
    .reduce((sum, item) => sum + item.totalPrice, 0);

export const selectAppliedCoupon = (state: { cart: CartState }) => ({
  code: state.cart.couponCode,
  discount: state.cart.couponDiscount,
});

export const selectShippingCost = (state: { cart: CartState }) =>
  state.cart.items.filter((i) => i.selected !== false).length > 0
    ? state.cart.shippingCost
    : 0;

export const selectCartTax = (state: { cart: CartState }) => {
  const subtotal = selectSelectedSubtotal(state);
  // GST 18% standard construction rate on net amount
  const discounted = Math.max(0, subtotal - state.cart.couponDiscount);
  return Math.round(discounted * 0.18);
};

export const selectCartGrandTotal = (state: { cart: CartState }) => {
  const subtotal = selectSelectedSubtotal(state);
  if (subtotal === 0) return 0;
  const discount = state.cart.couponDiscount;
  const shipping = selectShippingCost(state);
  const tax = selectCartTax(state);
  return Math.max(0, subtotal - discount + shipping + tax);
};

export const selectCartToast = (state: { cart: CartState }) =>
  state.cart.addedToast;

export default cartSlice.reducer;
