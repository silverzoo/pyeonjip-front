import React from 'react';
import OrderItem from './OrderItem';

function OrderList({ orders, onDelete }) {
    return (
        <div>
            <div className="admin-order-header">
                <span style={{marginLeft: '10px', width: '200px'}}><strong>ID</strong></span>
                <span style={{marginLeft: '25px', width: '400px'}}><strong>이름</strong></span>
                <span style={{marginLeft: '23px'}}><strong>이메일</strong></span>
                <span style={{marginLeft: '12px', width: '500px'}}><strong>전화번호</strong></span>
                <span style={{marginLeft: '65px', width: '500px'}}><strong>주문상태</strong></span>
                <span style={{marginLeft: '14px'}}><strong>주문일</strong></span>
                <span style={{marginLeft: '3px'}}><strong>배송 상태</strong></span>
                <span style={{}}><strong></strong></span>
            </div>
            <ul className="admin-order-list">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <OrderItem
                            key={order.id}
                            order={order}
                            onDelete={onDelete}
                        />
                    ))
                ) : (
                    <li style={{marginLeft: '10px'}}>주문이 없습니다.</li>
                )}
            </ul>
        </div>
    );
}

export default OrderList;
