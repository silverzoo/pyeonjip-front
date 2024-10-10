import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!email && !password) {
            setErrorMessage("이메일, 비밀번호를 입력해주세요.");
            return;
        } else if (!email) {
            setErrorMessage("이메일이 입력되지 않았습니다.");
            return;
        } else if (!validateEmail(email)) {
            setErrorMessage("유효한 이메일 주소를 입력해주세요.");
            return;
        } else if (!password) {
            setErrorMessage("비밀번호가 입력되지 않았습니다.");
            return;
        }

        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        if (response.ok) {
            navigate('/');
        } else {
            setErrorMessage('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해 주세요.');
        }
    };

    return (
        <div className="container-user h-100 d-flex justify-content-center align-items-center">
            <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center">
                    <h3 className="text-left mb-1">LOGIN</h3>
                    <div className="user-link">
                        <a href="/" className="text-muted">뒤로가기</a>
                    </div>
                </div>
                <hr />
                <form onSubmit={handleLogin}>
                    <div className="form-group mb-3">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="user-link">
                            <a href="/find-account">계정 찾기</a>
                            <a href="/reset-password">비밀번호 재설정</a>
                            <a href="/signup">회원가입</a>
                        </div>
                        <div>
                            <button type="submit" className="btn-user btn-sm user-btn">로그인</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;