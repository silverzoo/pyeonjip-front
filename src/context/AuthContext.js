import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // 주의: {} 없이 사용합니다.

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(!!localStorage.getItem('access'));
    const [email, setEmail] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // 로그인 상태 및 이메일 설정
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
    };

    // 최초 렌더링 시 로그인 상태 확인 및 리스너 등록
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
