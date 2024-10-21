// 공통 에러 처리 함수
import axiosInstance from "../utils/axiosInstance";

const handleErrorResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
};

// 모든 카테고리 가져오기
export const fetchGetCategories = async () => {
    const response = await fetch('/api/category');
    await handleErrorResponse(response);
    return await response.json();
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