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
        <div className="admin-order-page">
            <div className="admin-order-title">주문 관리 페이지</div>
            <Search/>
            <OrderList orders={orders} />
        </div>
    );
}

export default AdminOrder;


// function AdminOrder() {
//     const [orders, setOrders] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(0);
//     const ordersPerPage = 10; // 한 페이지에 보여줄 주문 수
//
//     useEffect(() => {
//         fetch(`http://localhost:8080/api/admin/orders?page=${currentPage}&size=${ordersPerPage}`)
//             .then(response => response.json())
//             .then(data => {
//                 setOrders(data.orders); // 실제 데이터 구조에 맞게 수정
//                 setTotalPages(data.totalPages); // 전체 페이지 수 설정
//             })
//             .catch(error => console.error(error));
//     }, [currentPage]);
//
//     const handleNextPage = () => {
//         if (currentPage < totalPages) {
//             setCurrentPage(prev => prev + 1);
//         }
//     };
//
//     const handlePreviousPage = () => {
//         if (currentPage > 1) {
//             setCurrentPage(prev => prev - 1);
//         }
//     };
//
//     return (
//         <div className="admin-order-page">
//             <div className="admin-order-title">주문 관리 페이지</div>
//             <Search />
//             <OrderList orders={orders} />
//             <div className="pagination">
//                 <button onClick={handlePreviousPage} disabled={currentPage === 1}>이전</button>
//                 <span>페이지 {currentPage} / {totalPages}</span>
//                 <button onClick={handleNextPage} disabled={currentPage === totalPages}>다음</button>
//             </div>
//         </div>
//     );
// }
//
// export default AdminOrder;
