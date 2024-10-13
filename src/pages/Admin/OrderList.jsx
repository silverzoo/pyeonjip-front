import React from 'react';
import OrderItem from './OrderItem';

function OrderList({ orders }) {
    return (
        <div className="order-list">
            <h2 className="mb-4">주문 목록</h2>
            {orders.length > 0 ? (
                <ul className="list-group">
                    {orders.map(order => (
                        <OrderItem key={order.id} order={order} />
                    ))}
                </ul>
            ) : (
                <p className="text-muted">주문이 없습니다.</p>
            )}
        </div>
    );
}

export default OrderList;
