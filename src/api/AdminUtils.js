// 공통 에러 처리 함수
import axiosInstance from "../utils/axiosInstance";
const BASE_URL = "https://dsrkzpzrzxqkarjw.tunnel-pt.elice.io/";

const handleErrorResponse = async (error) => {
    if (error.response) {
        throw new Error(error.response.data.message || '알 수 없는 에러가 발생했습니다.');
    }
    // 네트워크 오류 처리
    throw new Error('네트워크 오류가 발생했습니다.');
};

// 모든 카테고리 가져오기
export const fetchGetCategories = async () => {
    const response = await fetch(BASE_URL + `/api/category`);
    if (!response.ok) {
        const errorData = await response.json(); // JSON 형태로 변환
        throw new Error(errorData.message || '카테고리를 가져오는 중 에러가 발생했습니다.');
    }
    return await response.json();
};

// ADMIN - 카테고리 삭제
export const fetchDeleteCategory = async (categoryId) => {
    const response = await fetch(BASE_URL + `/api/admin/category?categoryIds=${categoryId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        await handleErrorResponse(response);
    }
    return true;
};

// ADMIN - 카테고리 생성
export const fetchCreateCategory = async (categoryData) => {
    const response = await fetch(BASE_URL + `/api/admin/category`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryData.name }),
    });
    if (!response.ok) {
        await handleErrorResponse(response);
    }
    return await response.json();
};

// ADMIN - 카테고리 수정
export const fetchUpdateCategory = async (categoryId, categoryData) => {
    const response = await fetch(BASE_URL + `/api/admin/category/${categoryId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
        await handleErrorResponse(response);
    }
    return await response.json();
};

// ADMIN - 모든 주문목록 가져오기
export const fetchGetOrders = async (page = 0, size = 5, sortField = 'createdAt', sortDir = 'desc', keyword = '') => {
    const response = await fetch(BASE_URL + `/api/admin/orders?page=${page}&size=${size}&sortField=${sortField}&sortDir=${sortDir}&keyword=${keyword}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        await handleErrorResponse(response);
    }
    return await response.json();
};

// ADMIN - 배송상태 수정
export const fetchUpdateOrder = async (orderId, deliveryStatus) => {
    const response = await fetch(BASE_URL + `/api/admin/orders/${orderId}?deliveryStatus=${deliveryStatus}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        await handleErrorResponse(response);
    }
    return await response.json();
};

// ADMIN - 주문 삭제
export const fetchDeleteOrder = async (orderId) => {
    const response = await fetch(BASE_URL + `/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        await handleErrorResponse(response);
    }
    return true;
};