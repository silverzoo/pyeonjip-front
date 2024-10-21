const API_BASE_URL = 'http://localhost:8080/api/coupon';

export const fetchCouponsAPI = async () => {
    const response = await fetch(API_BASE_URL);
    return await response.json();
};

export const createCouponAPI = async (coupon) => {
    const response = await fetch(`${API_BASE_URL}/custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coupon),
    });
    if (!response.ok) throw new Error('쿠폰 생성에 실패했습니다.');
    return await response.json();
};

export const updateCouponAPI = async (coupon) => {
    const response = await fetch(`${API_BASE_URL}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coupon),
    });
    if (!response.ok) throw new Error('쿠폰 수정에 실패했습니다.');
    return await response.json();
};

export const deleteCouponAPI = async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('쿠폰 삭제에 실패했습니다.');
};

export const createRandomCouponAPI = async (discount) => {
    const response = await fetch(`${API_BASE_URL}?discount=${discount}`, { method: 'POST' });
    if (!response.ok) throw new Error('랜덤 쿠폰 생성에 실패했습니다.');
    return await response.json();
};
