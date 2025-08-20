import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    })
    const [loading, setLoading ] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("name")
        if (token && name) {
            setUser({ token, name });
        }
        setLoading(false)
    }, []);

    const login = (token, userData) => {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(userData))
        setUser({ userData });
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user")
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}