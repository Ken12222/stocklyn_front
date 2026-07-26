import { create } from "zustand";

export const useWishListStore = create((set) => ({
  wishList: [],
  setWishList: (item) => set(state => {
    if(state.wishList === item) return state;
    return { wishList: [...state.wishList, item] }
  }),
  removeItem: (itemID)=> set((state) => {
         const productInWishList = state.wishList.filter(
        (product) => product !== itemID,
     );

      return {
        wishList: productInWishList,
       };
    })
}));