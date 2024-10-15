import React from 'react';

function OrderItem({ order, isSelected, onSelect }) {
    return (
        <li className={`admin-order-item ${isSelected ? 'selected' : ''}`}>
            <input
                type="checkbox"
                checked={isSelected}
                onChange={onSelect}
            />
            <p className="admin-order-id">주문 번호: {order.id}</p>
            <p><strong>주문자:</strong> {order.userName}</p>
            <p><strong>주문 상태:</strong> {order.status}</p>
            <p><strong>총 금액:</strong> {order.totalPrice.toLocaleString()}원</p>
        </li>
    );
}

export default OrderItem;
