import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import {isAccessTokenValid} from "../utils/tokenUtils";
const AuthContext = createContext();

const getAuthData = () => {
    const token = localStorage.getItem("access");
    if(isAccessTokenValid(token)) {
        try {
            const decodedToken = jwtDecode(token);
            return {
                email: decodedToken.email,
                isLoggedIn: true,
                isAdmin: decodedToken.role === "ROLE_ADMIN",
            };
        } catch (error) {
            console.error("Token error:", error);
            localStorage.removeItem("access");

            return {
                email: null,
                isLoggedIn: false,
                isAdmin: false,
            };
        }
    } else {
        if(token) {
            localStorage.removeItem("access");
        }
        return {
            email: null,
            isLoggedIn: false,
            isAdmin: false,
        };
    }
}

const initialState = getAuthData();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(initialState.isLoggedIn);
    const [email, setEmail] = useState(initialState.email);
    const [isAdmin, setIsAdmin] = useState(initialState.isAdmin);

    const updateAuthState = () => {
        const newAuthData = getAuthData();

        setIsLoggedIn(newAuthData.isLoggedIn);
        setEmail(newAuthData.email);
        setIsAdmin(newAuthData.isAdmin);
    };

    useEffect(() => {
        updateAuthState();

        const handleAuthChange = () => updateAuthState();
        window.addEventListener('authChange', handleAuthChange);

        return () => {
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    const handleContextLogin = () => {
        const event = new Event('authChange');
        window.dispatchEvent(event);
    };

    const handleContextLogout = () => {
        const event = new Event('authChange');
        window.dispatchEvent(event);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, email, isAdmin, handleContextLogin, handleContextLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
