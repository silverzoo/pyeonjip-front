import { jwtDecode } from "jwt-decode";

/* Refresh Token */


/* Access Token */

// 토큰 존재 여부 확인
const isAccessTokenExist = (token) => {
    if (!token) {
        console.log('토큰이 존재하지 않습니다.');
        return false;
    }

    if (typeof token !== 'string') {
        console.log('유효하지 않은 토큰입니다.');
        return false;
    }

    console.log('내부: 토큰이 유효합니다.');
    return true;
}

// 토큰 만료 여부 확인
export const isAccessTokenExpired = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decodedToken.exp < currentTime;
    } catch (error) {
        console.error('Token validation error: ', error.message);
        return false;
    }
}


// 토큰 유효성 검사
const isAccessTokenValid = (token) => {

    // 1. 토큰 존재 여부 확인한다.
    if (!isAccessTokenExist(token)) {
        console.log('토큰이 존재하지 않습니다.');
        return false;
    }

    // 2. 토큰 만료 여부 확인한다.
    if (isAccessTokenExpired(token)) {
        console.log('토큰이 만료되었습니다.');
        return false;
    }

    console.log('토큰 유효성 검사 성공');
    return true;
}


// 토큰 재발급
const reissueToken = async () => {
    try {
        const response = await fetch('https://dsrkzpzrzxqkarjw.tunnel-pt.elice.io/api/auth/reissue', {
            method: 'POST',
            credentials: 'include' // 쿠키와 함께 요청
        });

        if (!response.ok) {
            throw new Error('토큰 재발급 실패');
        }

        const newAccessToken = response.headers.get('Authorization').split(' ')[1];
        localStorage.setItem('access', newAccessToken); // 새로운 액세스 토큰 저장

        console.log('토큰이 성공적으로 재발급되었습니다.');
        return newAccessToken;
    } catch (error) {
        console.error('토큰 재발급 실패: ', error);
        return null;
    }
};


// 전체 토큰 관리 함수
const checkAndReissueToken = async () => {
    const token = localStorage.getItem('access');

    // 토큰이 유효한지 확인
    if (!isAccessTokenValid(token)) {
        console.log('토큰이 유효하지 않으므로 재발급을 요청합니다.');
        const newToken = await reissueToken();
        return newToken ? true : false;
    }

    console.log('토큰이 유효합니다.');
    return true;
};

export { isAccessTokenValid, reissueToken, checkAndReissueToken };