import React, { useEffect, useState } from 'react';
import OrderList from './OrderList';
import './Order.css';
import Search from "../Search/Search";
import {fetchGetOrders} from "../../../utils/Api";
import {useNavigate} from "react-router-dom";

function AdminOrder() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = () => {
            fetchGetOrders()
                .then(data => {
                    setOrders(data.content);
                    setTotalPages(data.totalPages);
                })
                .catch(error => {
                    alert(error.message);
                    navigate('/admin');
                });
        };
        fetchData();
    }, [currentPage, navigate]);

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
