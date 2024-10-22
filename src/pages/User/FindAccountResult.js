import React from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import logo from "../../logo.svg";
import './User.css';

function FindAccountResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, email } = location.state || {};

    const handleResetPassword = () => {
        if (email && name) {
            // 이메일 값을 가지고 /reset 경로로 이동
            navigate('/reset', { state: { name, email } });
        }
    };

    const handleLoginPage = () => {
        if (email) {
            navigate('/login', {state: { name, email }})
        }
    }

    return (
        <div className="user-find-container d-flex justify-content-center align-items-center card border-0">
            <div className="col-md-6 user-form">
                <div className="user-login-logo text-center mb-5">
                    <Link to="/"><img src={logo} alt="logo" width="140"/></Link>
                </div>
                <h3 className="text-left mb-2">계정 찾기 결과</h3>
                <hr/>
                {email ? (
                    <p className="found-email">{name}님의 이메일은 {email} 입니다.</p>
                ) : (
                    <p>이메일 정보를 찾을 수 없습니다.</p>
                )}
                <div>
                    <button onClick={handleLoginPage} className="user-btn">로그인 페이지로 이동</button>
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
