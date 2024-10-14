import React, { useEffect, useState } from 'react';
import OrderList from './OrderList';
import './Order.css'
import Search from "../Search/Search";

function AdminOrder() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // 주문 목록 전체 조회 API 호출
        fetch("http://localhost:8080/api/admin/orders")
            .then(response => response.json())
            .then(data => setOrders(data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="admin-order-container">
            <div className="admin-order-title">주문 관리 페이지</div>
            <Search/>
            <OrderList orders={orders} />
        </div>
    );
}

export default AdminOrder;
