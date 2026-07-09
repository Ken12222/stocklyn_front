import { useQuery } from "@tanstack/react-query";
import api from "../axios";

const fetchData = async (url) => {
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

const useFetch = (url) => {
    const { data, error, isLoading, isFetching, isPending } = useQuery({
        queryKey: [url],
        queryFn: () => fetchData(url),
    });

    return { data, error, isLoading, isFetching, isPending };
}

export default useFetch;