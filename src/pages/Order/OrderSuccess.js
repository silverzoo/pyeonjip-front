import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

function OrderSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        // 3초 후 메인 페이지로 이동
        const timer = setTimeout(() => {
            navigate('/');
        }, 3000);

        // 컴포넌트 언마운트 시 타이머 클리어
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="order-success">
            <h2>주문완료</h2>
            <div className="check-icon">✔️</div>
            <p>주문 결제가 성공적으로 완료 되었습니다.</p>
        </div>
    );
}

export default OrderSuccess;