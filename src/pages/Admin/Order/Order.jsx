import React, { useEffect, useState } from 'react';
import OrderList from './OrderList';
import './Order.css';
import Search from "../Search/Search";
import { fetchGetOrders } from "../../../utils/Api/AdminUtils";
import { useNavigate } from "react-router-dom";

function AdminOrder() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchData = () => {
            fetchGetOrders(currentPage, 5, 'createdAt', 'desc', email)
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
    }, [currentPage, email, navigate]);

    const filteredOrders = orders.filter(order =>
        order.userEmail && order.userEmail.includes(email) // 이메일로 필터링
    );

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <div className="admin-order-page">
            <div className="admin-order-title">주문 관리 페이지</div>
            <Search setEmail={setEmail} />
            <OrderList orders={filteredOrders} /> {/* 필터링된 주문 목록 전달 */}
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 0}>이전</button>
                <span>페이지 {currentPage + 1} / {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>다음</button>
            </div>
        </div>
    );
}

export default AdminOrder;
