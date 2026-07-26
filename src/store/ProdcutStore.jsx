import {create} from "zustand"

export const useProductStore= create(set=>({
    products:[],
    setProducts: (products) =>set((state) => {
        if (state.products === products) return state;
        return { products };
    })
}))