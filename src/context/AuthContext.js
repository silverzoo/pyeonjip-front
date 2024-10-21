import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import {isAccessTokenValid} from "../utils/tokenUtils";
import {logout} from "../utils/authUtils";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
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

                // 에러 발생 시 로컬 스토리지의 Access 토큰 삭제
                localStorage.removeItem('access');
            }
        } else {
            setIsLogin(false);
            setEmail(null);
            setIsAdmin(false);

            // Access 토큰을 명시적으로 삭제한다.
            // if 조건을 사용하여 토큰을 두 번 삭제 시도하는 것을 방지한다.
            if (token) {
                localStorage.removeItem('access');
            }
        }
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
