/**
 * HINCH MART — Cart Redux Slice with Add-To-Cart Popup Notification
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
  addedToast: CartToastInfo | null;
}

const initialState: CartState = {
  items: [],
  couponCode: null,
  couponDiscount: 0,
  useWallet: false,
  addedToast: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
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
        state.items.push(action.payload);
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
        item.quantity = action.payload.quantity;
        item.totalPrice = item.quantity * item.unitPrice;
      }
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
    setCoupon: (state, action: PayloadAction<{ code: string; discount: number }>) => {
      state.couponCode = action.payload.code;
      state.couponDiscount = action.payload.discount;
    },
    removeCoupon: (state) => {
      state.couponCode = null;
      state.couponDiscount = 0;
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
  removeItem,
  clearCart,
  setCoupon,
  removeCoupon,
  setUseWallet,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
export const selectCartToast = (state: { cart: CartState }) => state.cart.addedToast;

export default cartSlice.reducer;
