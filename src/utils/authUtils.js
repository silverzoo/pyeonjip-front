export const isLoggedIn = () => !!localStorage.getItem('access');










export const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('access');

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