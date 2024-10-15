import React, { useState } from 'react';
import OrderItem from './OrderItem';

function OrderList({ orders }) {
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
            newSelectedState[order.id] = !selectAll; // 전체 선택/해제
        });
        setSelectedOrders(newSelectedState);
        setSelectAll(!selectAll);
    };

    const handleDeleteSelected = () => {
        const remainingOrders = orders.filter(order => !selectedOrders[order.id]);
        console.log("선택된 주문 삭제:", selectedOrders);
        console.log("남은 주문:", remainingOrders);
        // 여기서 remainingOrders를 서버에 업데이트하는 API 호출을 추가할 수 있습니다.
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
                {orders.map(order => (
                    <OrderItem
                        key={order.id}
                        order={order}
                        isSelected={!!selectedOrders[order.id]}
                        onSelect={() => handleSelectOrder(order.id)}
                    />
                ))}
            </ul>
        </div>
    );
}

export default OrderList;
