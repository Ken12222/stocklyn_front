import Staff from "@/pages/Staff/Staff"
import {create} from "zustand"

export const useStaffStore = create((set)=>({
    Staff: [],
    setStaff:(staff)=>(set(state=> {
        if(state.Staff === staff) return state
        return {Staff: staff}}
    ))
}))