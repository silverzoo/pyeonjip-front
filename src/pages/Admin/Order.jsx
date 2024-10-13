import React, { useEffect, useState } from 'react';
import OrderList from './OrderList';
import './Order.css'

function Order() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // 주문 목록 전체 조회 API 호출
        fetch("http://localhost:8080/api/admin/orders")
            .then(response => response.json())
            .then(data => setOrders(data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="admin-order-page container">
            <h1 className="my-4 text-center">주문 관리 페이지</h1>
            <OrderList orders={orders} />
        </div>
    );
}

export default Order;
