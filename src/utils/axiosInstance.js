import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,  // http://localhost:8080입니다
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
});

// axiosInstance.interceptors.response.use(
//     (res) => {
//         return res;
//     },
//     async (error) => {
//         if (error.response.status === 401) {
//             try {
//                 // 토큰 재발급 요청
//                 const response = await axios.post('/api/auth/reissue', {}, { withCredentials: true });
//
//                 // 새 Access 토큰을 저장
//                 const authorizationHeader = response.headers['Authorization'] || response.headers['authorization'];
//
//                 const newAccessToken = authorizationHeader.split(' ')[1];
//                 console.log(newAccessToken);
//                 localStorage.setItem('access', newAccessToken);
//
//                 // 원래 요청 재시도
//                 console.log('재요청 시도')
//                 error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
//                 return axios.request(error.config);  // error._config 대신 error.config 사용
//             } catch (tokenError) {
//                 // 재발급 실패 시 로그인 페이지로 리다이렉트
//                 window.location.href = "/login";
//             }
//         }
//         return Promise.reject(error);
//     }
// );


// 재발급하고 재요청까지 됨.
// Response Interceptor: Access 토큰이 만료되면 재발급 로직을 실행한 후, 원 요청을 재시도한다.
axiosInstance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (error) => {
        // 401 에러 발생하면 실행
        if (error.response.status === 401) {
            try {
                // 토큰 재발급 요청. withCredential: true 설정으로 Refresh 토큰이 담긴 쿠키를 보낸다.
                const response = await axios.post('/api/auth/reissue', {}, { withCredentials: true });

                // 현재 백엔드에서 재발급 성공 시 200 응답 반환하도록 설정되어 있음.
                if (!response.status === 200) {
                    throw new Error('토큰 재발급 실패');
                }

                // 새 액세스 토큰 추출 및 저장
                // 대소문자 검사. A로 보이는데 실제 값은 a인 경우가 있다..
                const authorizationHeader = response.headers['authorization'] || response.headers['Authorization'];
                if (authorizationHeader) {
                    const newAccessToken = authorizationHeader.split(' ')[1];
                    localStorage.setItem('access', newAccessToken);

                    console.log('토큰이 성공적으로 재발급되었습니다.');
                } else {
                    throw new Error('Authorization 헤더가 없습니다.');
                }

                // 원래 요청 재시도
                console.log('Retry Request');
                error.config.headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                return axios.request(error.config);
            } catch (tokenError) {
                // 재발급 실패 시 로그인 페이지로 리다이렉트
                alert('토큰이 만료되었습니다. 로그인 페이지로 이동합니다.');
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

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

// // Response Interceptor: Access 토큰 만료 시 재발급 로직
// axiosInstance.interceptors.response.use((response) => {
//     return response;
// }, async (error) => {
//     const originalRequest = error.config;
//
//     if (error.response.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
//
//         try {
//             // 토큰 재발급 엔드포인트로 Refresh 토큰을 사용해 Access 토큰을 재발급
//             const response = await axios.post('/api/auth/reissue', {}, { withCredentials: true });
//
//             // 대소문자 대응을 위해 추가했음
//             const authorizationHeader = response.headers['authorization'] || response.headers['Authorization'];
//
//             // 새 Access 토큰 저장
//             const newAccessToken = authorizationHeader.headers['Authorization'].split(' ')[1];
//             localStorage.setItem('access', newAccessToken);
//
//             // 재발급된 Access 토큰을 가지고 원래 요청 재시도
//             console.log('재요청 시도')
//             originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//             return axiosInstance({
//                 ...originalRequest,
//                 withCredentials: true  // 쿠키를 포함한 재시도
//             });
//
//         } catch (reissueError) {
//             // 재발급 실패 시 로그아웃 처리
//             localStorage.removeItem('access');
//             window.location.href = '/login'; // 로그인 페이지로 리다이렉트
//         }
//     }
//
//     return Promise.reject(error);
// });

// axiosInstance.interceptors.response.use(
//     function (response) {
//         return response;
//     },
//     function (error) {
//         if (error.response && error.response.status) {
//             switch (error.response.status) {
//                 // status code가 401인 경우 `logout`을 커밋하고 `/login` 페이지로 리다이렉트
//                 case 401:
//                     store.commit('auth/logout');
//                     router.push('/login').catch(() => {});
//                     // 이행되지 않는 Promise를 반환하여 Promise Chaining 끊어주기
//                     return new Promise(() => {});
//                 default:
//                     return Promise.reject(error);
//             }
//         }
//         return Promise.reject(error);
//     },
// );


export default axiosInstance;
