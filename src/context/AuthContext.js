import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import {isAccessTokenValid} from "../utils/tokenUtils";
import {logout} from "../utils/authUtils";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 초기 로그인 여부 판단에 Access 토큰 유효성 검증 추가
    const [isLogin, setIsLogin] = useState(!!isAccessTokenValid(localStorage.getItem('access')));
    const [email, setEmail] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // 의문: 꼭 동기 함수로 써야 되는지, 현재 비동기로 수정했음.
    const updateAuthState = async () => {
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

                // 로그아웃 로직으로 모든 토큰을 삭제
                await logout();
            }
        } else {
            setIsLogin(false);
            setEmail(null);
            setIsAdmin(false);

            // logout 로직으로 Access 토큰과 Refresh 토큰을 명시적으로 삭제한다.
            // 원래 로그아웃 버튼을 클릭하면 로그아웃 로직이 두 번 실행된다.
            // if 조건을 사용하여 그를 방지한다.
            if (token) {
                await logout();
            }
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
