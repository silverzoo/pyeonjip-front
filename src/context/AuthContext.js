import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(!!localStorage.getItem('access'));
    const [email, setEmail] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const updateAuthState = () => {
        const token = localStorage.getItem('access');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setEmail(decodedToken.email);
                setIsLogin(true);
                setIsAdmin(decodedToken.role === 'ROLE_ADMIN');
            } catch (error) {
                console.error('Token error:', error);
                setIsLogin(false);
                setIsAdmin(false);
            }
        } else {
            setIsLogin(false);
            setEmail(null);
            setIsAdmin(false);
        }
        console.log(email);
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
        localStorage.removeItem('access');
        const event = new Event('authChange');
        window.dispatchEvent(event);
    };

    return (
        <AuthContext.Provider value={{ isLogin, email, isAdmin, handleContextLogin, handleContextLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
