// OrderList.js
import React from 'react';
import OrderItem from './OrderItem';

function OrderList({ orders, onDelete }) {
    return (
        <div>
            <div className="admin-order-header">
                <span><strong>이름</strong></span>
                <span><strong>이메일</strong></span>
                <span><strong>주문 상태</strong></span>
                <span><strong>총 금액</strong></span>
                <span><strong>생성일</strong></span>
                <span><strong>배송 상태</strong></span>
                <button style={{marginLeft: '30px'}}>버튼</button>
                <button style={{marginLeft: '30px'}}>버튼</button>
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
