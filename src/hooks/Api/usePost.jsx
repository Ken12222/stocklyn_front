import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import api from "../axios";

const fetch = async (url, data) => {
    try {
        await api.get("/sanctum/csrf-cookie");
        const response = await api.post(url, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

const usePost = (url) => {

    const { mutate, data, error, isLoading, isError, isSuccess } = useMutation({
        mutationFn: (credentials) => fetch(url, credentials),
    });

    return { mutate, data, error, isLoading, isError, isSuccess };
}

export default usePost;