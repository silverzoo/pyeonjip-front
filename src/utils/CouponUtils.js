export const fetchCouponsAPI = async () => {
    const response = await fetch('/api/coupon');
    return await response.json();
};

export const createCouponAPI = async (coupon) => {
    const response = await fetch(`/api/coupon/custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coupon),
    });
    if (!response.ok) throw new Error('쿠폰 생성에 실패했습니다.');
    return await response.json();
};

export const updateCouponAPI = async (coupon) => {
    const response = await fetch(`/api/coupon`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coupon),
    });
    if (!response.ok) throw new Error('쿠폰 수정에 실패했습니다.');
    return await response.json();
};

export const deleteCouponAPI = async (id) => {
    const response = await fetch(`/api/coupon/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('쿠폰 삭제에 실패했습니다.');
};

export const createRandomCouponAPI = async (discount) => {
    const response = await fetch(`/api/coupon?discount=${discount}`, { method: 'POST' });
    if (!response.ok) throw new Error('랜덤 쿠폰 생성에 실패했습니다.');
    return await response.json();
};
