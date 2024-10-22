import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './User.css';  // 기존 FindAccount와 같은 CSS 사용
import logo from "../../logo.svg";

function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState(location.state?.email || '');
    const [name, setName] = useState(location.state?.name || '');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();

        // 폼을 제출할 때만 경고 메시지를 표시하도록 수정
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
            const response = await fetch('http://localhost:8080/api/auth/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });

            const checkResult = await response.json();

            if (checkResult.data === true) {
                // 이메일 발송 전에 성공 화면으로 이동
                navigate('/reset/result', { state: { email } });

                // 비밀번호 재설정 이메일 발송 API 호출
                await fetch('http://localhost:8080/api/auth/check/reset', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, name }),
                });
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
        <div className="user-find-container h-100 d-flex justify-content-center align-items-center card border-0">
            <div className="col-md-6">
                <div className="user-login-logo text-center mb-5">
                    <Link to="/"><img src={logo} alt="logo" width="140" /></Link>
                </div>
                <h3 className="text-left mb-2">비밀번호 재설정</h3>
                <hr />
                <form onSubmit={handleResetPassword}>
                    <div className="form-group mb-3">
                        <label htmlFor="name">이름</label>
                        <input
                            type="text"
                            className="form-control user-form-control"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            className="form-control user-form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ marginBottom: '40px' }}
                        />
                    </div>
                    {/* 폼 제출 후에만 경고 메시지가 나타나도록 처리 */}
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    {successMessage && <p className="text-success">{successMessage}</p>}
                    <button type="submit" className="btn btn-sm user-btn btn-dark">비밀번호 재설정</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
