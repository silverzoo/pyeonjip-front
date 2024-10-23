import React from 'react';
import OrderItem from './OrderItem';

function OrderList({ orders, onDelete }) {
    return (
        <div>
            <div className="admin-order-header">
                <span><strong></strong></span>
                <span style={{marginLeft: '10px'}}><strong>이름</strong></span>
                <span style={{marginLeft: '30px'}}><strong>이메일</strong></span>
                <span style={{marginLeft: '50px'}}><strong>전화번호</strong></span>
                <span><strong>주문상태</strong></span>
                <span style={{marginRight: '40px'}}><strong>주문일</strong></span>
                <span style={{marginRight: '210px'}}><strong>배송 상태</strong></span>
            </div>
            <ul className="admin-order-list">
                {orders.map((order) => (
                    <OrderItem
                        key={order.id}
                        order={order}
                        onDelete={onDelete}
                    />
                ))}
            </ul>
        </div>
    );
}

export default OrderList;
