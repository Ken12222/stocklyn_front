import {create} from "zustand"

export const useTransferStore = create(set=>({
    transfers:[],
    setTransfers:(transfers)=>set(state=>{
        if(state.transfers === transfers) return state;
        return {transfers}
    })
}))