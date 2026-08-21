/**
 * HINCH MART — Wishlist Redux Slice
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  productIds: string[];
}

const initialState: WishlistState = {
  productIds: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const index = state.productIds.indexOf(action.payload);
      if (index >= 0) {
        state.productIds.splice(index, 1);
      } else {
        state.productIds.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.productIds = state.productIds.filter((id) => id !== action.payload);
    },
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.productIds = action.payload;
    },
    clearWishlist: (state) => {
      state.productIds = [];
    },
  },
});

export const { toggleWishlist, removeFromWishlist, setWishlist, clearWishlist } = wishlistSlice.actions;

export const selectIsWishlisted = (productId: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist.productIds.includes(productId);
export const selectWishlistItems = (state: { wishlist: WishlistState }): string[] =>
  state.wishlist.productIds;
export const selectWishlistCount = (state: { wishlist: WishlistState }) =>
  state.wishlist.productIds.length;

export default wishlistSlice.reducer;
