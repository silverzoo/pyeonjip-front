import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,  // http://localhost:8080입니다
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Access 토큰을 모든 요청에 추가
axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Access 토큰 만료 시 재발급 로직
axiosInstance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            // 토큰 재발급 엔드포인트로 Refresh 토큰을 사용해 Access 토큰을 재발급
            const response = await axios.post('/api/user/reissue', {}, { withCredentials: true });

            // 새 Access 토큰 저장
            const newAccessToken = response.headers['Authorization'].split(' ')[1];
            localStorage.setItem('access', newAccessToken);

            // 재발급된 Access 토큰을 가지고 원래 요청 재시도
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);

        } catch (reissueError) {
            // 재발급 실패 시 로그아웃 처리
            localStorage.removeItem('access');
            window.location.href = '/login'; // 로그인 페이지로 리다이렉트
        }
    }

    return Promise.reject(error);
});

export default axiosInstance;
