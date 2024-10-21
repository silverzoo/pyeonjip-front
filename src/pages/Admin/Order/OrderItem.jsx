import React, { useEffect, useState } from 'react';
import { fetchDeleteOrder, fetchUpdateOrder } from '../../../api/AdminUtils';

function OrderItem({ order, onDelete }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState(order.deliveryStatus);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options).replace(/\//g, '-');
    };

    useEffect(() => {
        setSelectedDeliveryStatus(order.deliveryStatus);
    }, [order.deliveryStatus]);

    const toggleDetails = () => {
        setIsExpanded(prev => !prev);
    };

    const handleDelete = () => {
        onDelete(order.id);
    };

    const handleDeliveryStatusChange = (event) => {
        setSelectedDeliveryStatus(event.target.value);
    };

    const handleEdit = async (event) => {
        event.stopPropagation();
        try {
            await fetchUpdateOrder(order.id, selectedDeliveryStatus);
            alert('배송 상태가 업데이트되었습니다.');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <>
            <li className="admin-order-item">
                <span onClick={toggleDetails}>{order.userName}</span>
                <span onClick={toggleDetails}>{order.userEmail}</span>
                <span onClick={toggleDetails}>{order.orderStatus}</span>
                <span onClick={toggleDetails}>{order.totalPrice.toLocaleString()}원</span>
                <span onClick={toggleDetails}>{formatDate(order.createdAt)}</span>
                <span>
                    <select value={selectedDeliveryStatus} onChange={handleDeliveryStatusChange}>
                        <option value="READY">READY</option>
                        <option value="SHIPPING">SHIPPING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="REFUNDING">REFUNDING</option>
                    </select>
                </span>
                <button onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? '삭제 중...' : '삭제'}
                </button>
                <button onClick={handleEdit}>
                    수정
                </button>
            </li>
            {isExpanded && (
                <div className="admin-order-details">
                    {order.orderDetails.map(detail => (
                        <div key={detail.productDetailId} className="admin-order-detail-item">
                            {detail.productImage && (
                                <img src={detail.productImage} alt={detail.productName} className="product-image" />
                            )}
                            <div className="admin-order-detail-info">
                                <span><strong>제품명:</strong> {detail.productName}</span>
                                <span><strong>수량:</strong> {detail.quantity}</span>
                                <span><strong>제품 가격:</strong> {detail.productPrice.toLocaleString()}원</span>
                                <span><strong>총 금액:</strong> {detail.subTotalPrice.toLocaleString()}원</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default OrderItem;
