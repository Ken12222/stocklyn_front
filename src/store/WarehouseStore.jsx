import {create} from "zustand";

export const useWarehouseStore = create(set=>({
    warehouses: [],
    setWarehouses:(warehouses)=>set(state=>{
        if(state.warehouses === warehouses) return state
        return {warehouses}
    }),
    removeWarehouse: (warehouseID)=>set(state=>{
        const newWarehouses = state.warehouses.filter(warehouse=>warehouse.id !== warehouseID)
        return {warehouses: newWarehouses}
    }),
    warehouse: {},
    setWarehouse:(warehouse)=>set(state=>{
        if(state.warehouse === warehouse) return state

        return {warehouse}
    })
}))