import React, { useState } from 'react';
import OrderItem from './OrderItem';

function OrderList({ orders = [] }) { // orders를 props로 받아옵니다.
    const [selectedOrders, setSelectedOrders] = useState({});
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectOrder = (orderId) => {
        setSelectedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    const handleSelectAll = () => {
        const newSelectedState = {};
        orders.forEach(order => {
            newSelectedState[order.id] = !selectAll;
        });
        setSelectedOrders(newSelectedState);
        setSelectAll(!selectAll);
    };

    const handleDeleteSelected = () => {
        const remainingOrders = orders.filter(order => !selectedOrders[order.id]);
        console.log("선택된 주문 삭제:", selectedOrders);
        console.log("남은 주문:", remainingOrders);
    };

    return (
        <div className="admin-order-list">
            <div className="admin-order-list-header">
                <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                />
                <button className="admin-order-delete-button" onClick={handleDeleteSelected}>
                    선택한 주문 삭제
                </button>
            </div>
            <ul className="admin-order-list-container">
                {Array.isArray(orders) && orders.length > 0 ? (
                    orders.map(order => (
                        <OrderItem
                            key={order.id}
                            order={order}
                            isSelected={!!selectedOrders[order.id]}
                            onSelect={() => handleSelectOrder(order.id)}
                        />
                    ))
                ) : (
                    <li>주문이 없습니다.</li>
                )}
            </ul>
        </div>
    );
}

export default OrderList;
