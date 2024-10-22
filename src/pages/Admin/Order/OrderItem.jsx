import React, { useEffect, useState } from 'react';
import { fetchDeleteOrder, fetchUpdateOrder } from '../../../api/AdminUtils';
import {toast} from "react-toastify";

function OrderItem({ order, onDelete }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState(order.deliveryStatus);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour12: false,
            timeZone: 'Asia/Seoul'
        };
        return new Intl.DateTimeFormat('ko-KR', options).format(date);
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

        // 현재 값과 선택한 값이 동일한지 체크
        if (selectedDeliveryStatus === order.deliveryStatus) {
            toast.warn('수정할 사항이 없습니다.', {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        try {
            await fetchUpdateOrder(order.id, selectedDeliveryStatus);
            toast.success('배송 상태가 업데이트되었습니다.', {
                position: "top-center",
                autoClose: 2000,
            });
        } catch (error) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    return (
        <>
            <div className="admin-order-item">
                <span onClick={toggleDetails} style={{flexGrow: '0', width: '300px', color: '#343a40', fontWeight: 'bold', fontSize: '14px'}}>{order.id}</span>
                <span onClick={toggleDetails} style={{flexGrow: '0', width: '500px'}}>{order.userName}</span>
                <span onClick={toggleDetails} style={{flexGrow: '0'}}>{order.userEmail}</span>
                <span onClick={toggleDetails}>{order.phoneNumber}</span>
                <span onClick={toggleDetails} style={{flexGrow: '0', width: '500px'}}>{order.orderStatus}</span>
                <span onClick={toggleDetails}>{formatDate(order.createdAt)}</span>
                <span style={{ marginLeft: 'auto'}}>
                    <select className='form-select' value={selectedDeliveryStatus} onChange={handleDeliveryStatusChange}>
                        <option value="READY">READY</option>
                        <option value="SHIPPING">SHIPPING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="REFUNDING">REFUNDING</option>
                    </select>
                </span>
                <span>
                    <button onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? '삭제 중...' : '삭제'}
                    </button>
                    <button onClick={handleEdit}>
                        수정
                    </button>
                </span>
            </div>
            {isExpanded && (
                <div className="admin-order-details">
                    {order.orderDetails.map(detail => (
                        <div key={detail.productDetailId} className="admin-order-detail-item">
                            <div className="admin-order-detail-info">
                                {detail.productImage && (
                                    <img src={detail.productImage} alt={detail.productName} />
                                )}
                                <span style={{ marginRight: '20px' }}><strong>제품명:</strong> {detail.productName}</span>
                                <span style={{ flexGrow: '2', marginRight: '20px'}}><strong>옵션:</strong> {detail.productDetailName}</span>
                                <span style={{ flexGrow: '0', width: '200px'}}><strong>수량:</strong> {detail.quantity}</span>
                                <span><strong>금액:</strong> {detail.subTotalPrice.toLocaleString()}원</span>
                            </div>
                        </div>
                    ))}
                    <div className="admin-order-detail-totalPrice">
                        <span><strong>총 주문 금액:</strong> {order.totalPrice.toLocaleString()}원</span>
                    </div>
                </div>

            )}
        </>
    );
}

export default OrderItem;
