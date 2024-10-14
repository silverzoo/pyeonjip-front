import React from 'react';

function OrderItem({ order }) {
    return (
        <li className="list-group-item mb-3 shadow-sm p-3">
            <p className="order-id">주문 번호: {order.id}</p>
            <p><strong>주문자:</strong> {order.userName}</p>
            <p><strong>주문 상태:</strong> {order.status}</p>
            <p><strong>총 금액:</strong> {order.totalPrice.toLocaleString()}원</p>
            {/* 추가적인 주문 정보 */}
        </li>
    );
}

export default OrderItem;
