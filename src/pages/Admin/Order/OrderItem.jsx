import React, { useState } from 'react';

function OrderItem({ order, isSelected, onSelect }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const toggleDetails = () => {
        setIsExpanded(prev => !prev);
    };

    return (
        <>
            <li className={`admin-order-item ${isSelected ? 'selected' : ''}`}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelect}
                />
                <p className="admin-order-id" onClick={toggleDetails} style={{ cursor: 'pointer' }}>
                    주문 번호: {order.id} {isExpanded ? '▼' : '▲'}
                </p>
                <p><strong>주문자:</strong> {order.userName}</p>
                <p><strong>전화번호:</strong> {order.phoneNumber}</p>
                <p><strong>주문 상태:</strong> {order.orderStatus}</p>
                <p><strong>총 금액:</strong> {order.totalPrice.toLocaleString()}원</p>
                <p><strong>생성일:</strong> {formatDate(order.createdAt)}</p>
                <p><strong>배송 상태:</strong> {order.deliveryStatus}</p>
            </li>
            {isExpanded && (
                <ul className="order-details">
                    <p><strong>주문 상세:</strong></p>
                    {order.orderDetails.map(detail => (
                        <li key={detail.productDetailId}>
                            <p><strong>제품명:</strong> {detail.productName}</p>
                            <p><strong>수량:</strong> {detail.quantity}</p>
                            <p><strong>제품 가격:</strong> {detail.productPrice.toLocaleString()}원</p>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default OrderItem;
