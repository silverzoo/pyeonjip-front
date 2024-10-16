import React, { useState, useEffect } from 'react';

function OrderPage() {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = 1; // 실제 로그인된 사용자 ID로 변경 필요
    const cartDetails = JSON.parse(localStorage.getItem('cart')) || []; // 로컬 스토리지에서 카트 정보 가져오기

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                // POST 요청으로 데이터를 백엔드로 전송
                const response = await fetch('http://localhost:8080/api/orders/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        orderDetails: cartDetails,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setOrderData(data);
                setLoading(false);
            } catch (error) {
                console.error('데이터를 가져오는 중 오류 발생:', error);
                setError('데이터를 가져오는 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        fetchOrderData();
    }, []);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>주문 페이지</h2>
            <div>
                <h3>총 결제 금액</h3>
                <p>₩{orderData.totalPrice}</p>
                <h3>할인 후 가격</h3>
                <p>₩{orderData.disCountedTotalPrice}</p>
                <h3>쿠폰 할인율</h3>
                <p>{orderData.couponDiscountRate}%</p>
                <h3>등급에 따른 배송비</h3>
                <p>₩{orderData.deliveryPrice}</p>
                <h3>상품 목록</h3>
                <ul>
                    {orderData.orderDetails.map((item, index) => (
                        <li key={index}>
                            {item.productName} - ₩{item.productPrice} x {item.quantity}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default OrderPage;