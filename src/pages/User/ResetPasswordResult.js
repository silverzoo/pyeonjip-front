import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './User.css';
import logo from "../../logo.svg";

function ResetPasswordResult() {
    const location = useLocation();
    const { email } = location.state || { email: '알 수 없음' }; // 전송된 이메일 정보 받기

    return (
        <div className="reset-password-success-container d-flex flex-column align-items-center justify-content-start vh-100">
            <div className="user-reset-password-success-container">
                <div className="user-reset-password-logo text-center mb-5">
                    <Link to="/"><img src={logo} alt="logo" width="180"/></Link>
                </div>
                <div className="text-center">
                    <h5 className="user-reset-password-text mb-3 fw-semibold">비밀번호 재설정 이메일이 발송되었습니다!</h5>
                    <p className="mb-4">이메일({email})로 비밀번호 재설정 링크를 보냈습니다. 이메일을 확인해 주세요.</p>
                </div>
                <div className="d-flex justify-content-between mb-5">
                    <Link to="/login" className="btn btn-primary">로그인 페이지로 이동</Link>
                </div>
                <hr className="mb-3"/>
                <div className="text-center">
                    <p className="bottom-text mb-0"> Elice Cloud Track 4기 2차 프로젝트 5팀</p>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordResult;
