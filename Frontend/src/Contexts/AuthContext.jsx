import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from '../config/api'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true)
    const logout = async () => {
        const response = await fetch(`${import.meta.env.VITE_APIURL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            setUser(null);
        } else {
            throw new Error('Logout failed');
        }
    };

    const checkAuth = async () => {
        const response = await fetch(`${API_URL}/api/auth/check`, {
            credentials: 'include'
        })
        if(response.status == 200){
            const data = await response.json();
            setUser(data)
        }
        
        setLoadingUser(false)
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ logout, user, loadingUser, setUser }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => useContext(AuthContext);