import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import api from "../axios";

const del = async (url) => {
    try {
        await api.get("/sanctum/csrf-cookie");
        const response = await api.delete(`${url}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

const useDelete = (url) => {

    const { mutate, data, error, isPending, isError, isSuccess} = useMutation({
        mutationFn: ()=>del(url),
    });



    return { mutate, data, error, isPending, isError, isSuccess };
}

export default useDelete;