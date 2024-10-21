import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import {isAccessTokenValid} from "../utils/tokenUtils";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 초기 로그인 여부 판단에 Access 토큰 유효성 검증 추가
    const [isLogin, setIsLogin] = useState(!!isAccessTokenValid(localStorage.getItem('access')));
    const [email, setEmail] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const updateAuthState = () => {
        const token = localStorage.getItem('access');
        // Access 토큰 유효성 검증 추가. 더 정확한 로그인 상태 판단 가능
        if (isAccessTokenValid(token)) {
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

            // Access 토큰과 Refresh 토큰을 명시적으로 삭제한다.
            localStorage.removeItem('access');
            document.cookie = "refresh=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
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
        // Access 토큰과 Refresh 토큰을 명시적으로 삭제한다.
        localStorage.removeItem('access');
        document.cookie = "refresh=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

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
