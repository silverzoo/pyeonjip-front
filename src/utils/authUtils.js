import { jwtDecode } from 'jwt-decode';


// 토큰 유효성 검사
const isTokenValid = (token) => {

    // 1. 토큰 존재 여부 확인한다.
    if (!token) {
        console.warn('Invalid token: 토큰이 존재하지 않습니다.')
        return false;
    }

    // 2. 토큰 타입을 검증한다.
    if (typeof token !== 'string') {
        console.warn('Invalid token: 유효하지 않은 토큰입니다.')
    }

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // 3. 현재 시간과 만료 시간을 비교하여 유효성을 검증한다.
        return decodedToken.exp > currentTime;
    } catch (error) {
        console.error('Token validation error: ', error.message);
        return false;
    }
}


// 로그인 상태를 확인하는 함수.
// 위에서 정의한 유효성 검증 함수를 사용한다.
export const isLoggedIn = () => {
    const token = localStorage.getItem('access');
    return isTokenValid(token);
}


// API 요청 시, access 토큰을 Authorization 헤더에 자동으로 포함하는 함수.
// 현재 Filter는 'Bearer [토큰 내용]' 형식의 String을 받아서 검증을 수행합니다.
// 따라서 로컬 스토리지에서 가져온 토큰에 'Bearer '를 붙여서 헤더에 포함합니다.
export const fetchWithAuth = async (url, options = {}) => {

    // 1. 로컬 스토리지에서 access 토큰 가져오기
    const token = localStorage.getItem('access');

    // 2. 토큰 유효성 검사 수행
    if (!isTokenValid(token)) {
        throw new Error('토큰이 유효하지 않습니다. 로그인이 필요합니다.');
    }

    // 3. 토큰이 담긴 Authorization 헤더 추가하기
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        throw new Error('API 요청 실패');
    }
    return response.json();
};


// 사용자 이메일 가져오기
export const getUserEmail = () => {
    const token = localStorage.getItem('access');
    if (!token) return null;

    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.email;
    } catch (error) {
        console.error('Token error:', error);
        return null;
    }
};


// 사용자 권한 가져오기
export const getUserRole = () => {
    const token = localStorage.getItem('access');
    if (!token) return null;

    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.role;
    } catch (error) {
        console.error('Token error:', error);
        return null;
    }
};


// 로그아웃
export const logout = async () => {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Server logout failed');
        }
    } catch (error) {
        console.error('Logout error:', error.message);
        throw error;
    } finally {
        // 서버 응답 성공 여부와 관계없이 로컬 스토리지의 토큰은 항상 제거
        localStorage.removeItem('access');

        // Refresh 토큰은 백엔드에서 제거하므로 프론트에서는 따로 제거하지 않는다.
        // localStorage.removeItem('access');
    }
};
