import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './User.css';

function SignUpResult() {
    const location = useLocation();
    const { name, email } = location.state || {};

    const navigate = useNavigate();

    return (
        <div className="user-container h-100 d-flex justify-content-center align-items-center">
            <div className="col-md-6 user-form">
                {name ? (
                    <h3 className="found-email"> 가입을 축하합니다, {name} 님! </h3>
                ) : (
                    <h3>잘못된 접근입니다.</h3>
                )}
                <hr />
                {email ? (
                    <p className="found-email">로그인 아이디는 {email} 입니다.</p>
                ) : (
                    <p>정보를 찾을 수 없습니다.</p>
                )}
                <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-sm user-btn btn-dark" onClick={() => navigate('/login')}>
                        로그인 하러가기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignUpResult;
