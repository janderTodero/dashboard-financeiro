import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading ] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("name")
        if (token && name) {
            setUser({ token, name });
        }
        setLoading(false)
    }, []);

    const login = (token, name) => {
        localStorage.setItem("token", token)
        localStorage.setItem("name", name)
        setUser({ token, name });
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name")
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}