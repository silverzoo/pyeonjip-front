import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './User.css';
import logo from "../../logo.svg";
import { fetchWithAuth } from '../../utils/authUtils';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();

        if (!email && !name) {
            setErrorMessage("이메일과 이름을 입력해주세요.");
            return;
        } else if (!email) {
            setErrorMessage("이메일이 입력되지 않았습니다.");
            return;
        } else if (!validateEmail(email)) {
            setErrorMessage("유효한 이메일 주소를 입력해주세요.");
            return;
        } else if (!name) {
            setErrorMessage("이름이 입력되지 않았습니다.");
            return;
        }

        try {
            // 1. 이메일과 이름이 일치하는지 확인하는 API 호출
            const checkResult = await fetchWithAuth('http://localhost:8080/api/user/check/reset', {
                method: 'POST',
                body: JSON.stringify({ name, email }),
            });

            if (checkResult.check) {
                // 2. 일치하면 비밀번호 재설정 이메일 발송 API 호출
                await fetchWithAuth('http://localhost:8080/api/user/check/reset/sendEmail', {
                    method: 'POST',
                    body: JSON.stringify({ email, name }),
                });

                // 이메일 발송 성공 시 결과 화면으로 이동, 이메일 정보 전달
                navigate('/reset-password-success', { state: { email } });
            } else {
                setErrorMessage('입력하신 정보와 일치하는 사용자가 없습니다.');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage(error.message || '요청 처리 중 문제가 발생했습니다.');
            setSuccessMessage('');
        }
    };


    return (
        <div className="reset-password-container d-flex flex-column align-items-center justify-content-start vh-100">
            <div className="user-reset-password-container">
                <div className="user-reset-password-logo text-center mb-5">
                    <Link to="/"><img src={logo} alt="logo" width="180"/></Link>
                </div>
                <div className="text-center">
                    <h5 className="user-reset-password-text mb-3 fw-semibold">비밀번호 재설정</h5>
                </div>
                <form onSubmit={handleResetPassword} className="d-flex flex-column">
                    <input
                        type="text"
                        className="form-control user-form-control mb-3"
                        placeholder="이름"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        className="form-control user-form-control mb-4"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errorMessage && <p className="text-danger mb-3">{errorMessage}</p>}
                    {successMessage && <p className="text-success mb-3">{successMessage}</p>}
                    <button type="submit" className="btn user-reset-password-btn mb-4">비밀번호 재설정</button>
                </form>
                <div className="d-flex justify-content-between mb-5">
                    <Link to="/find" className="user-link">계정 찾기</Link>
                    <Link to="/signup" className="user-link">회원가입</Link>
                </div>
                <hr className="mb-3"/>
                <div className="text-center">
                    <p className="bottom-text mb-0"> Elice Cloud Track 4기 2차 프로젝트 5팀</p>
                </div>

            </div>
        </div>
    );
}

export default ResetPassword;
