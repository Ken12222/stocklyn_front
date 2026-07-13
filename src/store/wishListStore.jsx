import { create } from "zustand";

export const useWishListStore = create((set) => ({
  wishList: [],
  setWishList: (item) => set(state => ({ wishList: [...state.wishList, item] })),
  removeItem: (itemID)=> set((state) => {
      const productInWishList = state.wishList.filter(
        (product) => product.id !== itemID,
      );
      return {
        wishList: [...productInWishList],
      };
    })
}));