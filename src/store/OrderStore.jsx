import {create} from "zustand";

export const useOrderStore = create((set) => ({
  orders: [],
  setOrders: (orders) => set(state=> {
    if(state.orders === orders) return state
    return { orders }
  }),
}));