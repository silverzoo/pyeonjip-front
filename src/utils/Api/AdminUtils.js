// 공통 에러 처리 함수
const handleErrorResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
}

// 모든 카테고리 가져오기
export const fetchGetCategories = async () => {
    const response = await fetch('/api/category');
    await handleErrorResponse(response);
    return await response.json();
}

// ADMIN - 모든 주문목록 가져오기
export const fetchGetOrders = async (page = 0, size = 5, sortField = 'createdAt', sortDir = 'desc', keyword = '') => {
    const response = await fetch(`/api/admin/orders?page=${page}&size=${size}&sortField=${sortField}&sortDir=${sortDir}&keyword=${keyword}`);
    await handleErrorResponse(response);
    return await response.json();

    // 임의로 에러를 발생시키기 위해 조건을 추가
    // const shouldThrowError = true;
    //
    // if (shouldThrowError) {
    //     throw new Error("임의로 발생시킨 에러입니다.");
    // }
    //
    // const response = await fetch(`/api/admin/orders`);
    // await handleErrorResponse(response);
    // return await response.json();
}

// ADMIN - 배송상태 수정
export const fetchUpdateOrder = async (orderId, deliveryStatus) => {
    const response = await fetch(`/api/admin/orders/${orderId}?deliveryStatus=${deliveryStatus}`, {
        method: 'PATCH',
    });
    await handleErrorResponse(response);
    return await response.json();
}

// ADMIN - 주문 삭제
export const fetchDeleteOrder = async (orderId) => {
    const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
    });
    await handleErrorResponse(response);
    return response.ok;
}
