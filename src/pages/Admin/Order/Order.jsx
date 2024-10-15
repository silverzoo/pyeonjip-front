import React, { useEffect, useState } from 'react';
import OrderList from './OrderList';
import './Order.css';
import Search from "../Search/Search";

function AdminOrder() {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetch(`/api/admin/orders`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                setOrders(data.content); // content 배열에서 데이터 설정
                setTotalPages(data.totalPages); // 전체 페이지 수 설정
            })
            .catch(error => console.error("Fetch Error:", error));
    }, [currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <div className="admin-order-page">
            <div className="admin-order-title">주문 관리 페이지</div>
            <Search />
            <OrderList orders={orders} />
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>이전</button>
                <span>페이지 {currentPage} / {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>다음</button>
            </div>
        </div>
    );
}

export default AdminOrder;
