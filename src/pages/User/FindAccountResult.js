import React from 'react';
import { useLocation } from 'react-router-dom';
import './User.css';

function FindAccountResult() {
    const location = useLocation();
    const { email } = location.state || {};

    return (
        <div className="user-container h-100 d-flex justify-content-center align-items-center card vh-100 border-0">
            <div className="col-md-6 user-form">
                <h3 className="text-left mb-2">계정 찾기 결과</h3>
                <hr />
                {email ? (
                    <p className="found-email">회원님의 이메일은 {email} 입니다.</p>
                ) : (
                    <p>이메일 정보를 찾을 수 없습니다.</p>
                )}
                <div className="d-flex justify-content-end mt-3">
                    <a href="/login" className="user-btn">로그인 페이지로 이동</a>
                </div>
            </div>
        </div>
    );
}

export default FindAccountResult;
