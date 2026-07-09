import useFetch from "@/hooks/Api/useFetch";
import { createContext, useEffect, useState } from "react";


const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState();

    const { data, isLoading, isFetching } = useFetch("api/user");
    useEffect(() => {
        if (data) {
            setAuth(data);
        }
    }, [data]);

    return <AuthContext.Provider value={{ isLoading, auth, setAuth }}>
        {children}
    </AuthContext.Provider>
}

export default AuthContext;