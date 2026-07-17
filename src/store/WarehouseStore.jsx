import {create} from "zustand";

export const useWarehouseStore = create(set=>({
    warehouses: [],
    setWarehouses:(warehouses)=>set({warehouses}),
    removeWarehouse: (warehouseID)=>set(state=>{
        const newWarehouses = state.warehouses.filter(warehouse=>warehouse.id !== warehouseID)
        console.log(state.warehouses)
        return {warehouses: newWarehouses}
    }),
    warehouse: {},
    setWarehouse:(warehouse)=>set({warehouse})
}))