import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './User.css';

function FindAccountResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const { email } = location.state || {};

    const handleResetPassword = () => {
        if (email) {
            // 이메일 값을 가지고 /reset 경로로 이동
            navigate('/reset', { state: { email } });
        }
    };

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
                {email && (
                    <div className="d-flex justify-content-end mt-3">
                        <button className="user-btn" onClick={handleResetPassword}>
                            비밀번호 재설정
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FindAccountResult;
