import React from 'react';
import OrderItem from './OrderItem';

function OrderList({ orders }) {
    return (
        <div className="admin-order-list">
            {orders.length > 0 ? (
                <ul className="">
                    {orders.map(order => (
                        <OrderItem key={order.id} order={order}/>
                    ))}
                </ul>
            ) : (
                <p className="">주문이 없습니다.</p>
            )}
        </div>
    );
}

export default OrderList;
