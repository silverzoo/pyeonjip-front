// 공통 에러 처리 함수
import axiosInstance from "../utils/axiosInstance";

const handleErrorResponse = async (error) => {
    if (error.response) {
        throw new Error(error.response.data.message || '알 수 없는 에러가 발생했습니다.');
    }
    // 네트워크 오류 처리
    throw new Error('네트워크 오류가 발생했습니다.');
};

// 모든 카테고리 가져오기
export const fetchGetCategories = async () => {
    const response = await fetch('https://dsrkzpzrzxqkarjw.tunnel-pt.elice.io/api/category');
    if (!response.ok) {
        const errorData = await response.json(); // JSON 형태로 변환
        throw new Error(errorData.message || '카테고리를 가져오는 중 에러가 발생했습니다.');
    }
    return await response.json();
};

// ADMIN - 카테고리 삭제
export const fetchDeleteCategory = async (categoryId) => {
    try {
        await axiosInstance.delete(`/api/admin/category?categoryIds=${categoryId}`);
        return true;
    } catch (error) {
        await handleErrorResponse(error);
    }
};

// ADMIN - 카테고리 생성
export const fetchCreateCategory = async (categoryData) => {
    try {
        const response = await axiosInstance.post(`/api/admin/category`, {
            name: categoryData.name,
        });
        return response.data;
    } catch (error) {
        await handleErrorResponse(error);
    }
};

// ADMIN - 모든 주문목록 가져오기
export const fetchGetOrders = async (page = 0, size = 5, sortField = 'createdAt', sortDir = 'desc', keyword = '') => {
    try {
        const response = await axiosInstance.get(`/api/admin/orders`, {
            params: { page, size, sortField, sortDir, keyword }
        });
        return response.data;
    } catch (error) {
        await handleErrorResponse(error);
    }
};

// ADMIN - 배송상태 수정
export const fetchUpdateOrder = async (orderId, deliveryStatus) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/orders/${orderId}?deliveryStatus=${deliveryStatus}`, {
            deliveryStatus
        });
        return response.data;
    } catch (error) {
        await handleErrorResponse(error);
    }
};

// ADMIN - 주문 삭제
export const fetchDeleteOrder = async (orderId) => {
    try {
        await axiosInstance.delete(`/api/admin/orders/${orderId}`);
        return true;
    } catch (error) {
        await handleErrorResponse(error);
    }
};