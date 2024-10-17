import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './User.css';

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
            credentials: 'include' // 쿠키 사용 시 필요
        });

        if (response.ok) {
            // 응답 헤더에서 access 토큰 꺼내기
            const accessToken = response.headers.get('access');
            if (accessToken) {
                localStorage.setItem('access', accessToken); // access 토큰 로컬 스토리지에 저장
                navigate(-1);





            } else {
                setErrorMessage('Access 토큰을 가져오지 못했습니다.');
            }
        } else {
            if (response.status === 401) {
                setErrorMessage('이메일 또는 비밀번호가 잘못되었습니다.');
            } else if (response.status === 403) {
                setErrorMessage('접근 권한이 없습니다.');
            } else {
                setErrorMessage('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해 주세요.');
            }
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="user-container h-100 d-flex justify-content-center align-items-center">
            <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center">
                    <h3 className="text-left mb-1">로그인</h3>
                    <div className="user-link">
                        <a href="#" onClick={handleBack} className="text-muted">뒤로가기</a>
                    </div>
                </div>
                <hr />
                <form onSubmit={handleLogin}>
                    <div className="form-group mb-3">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            className="form-control user-form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            className="form-control user-form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}

                    <div className="d-flex justify-content-between align-items-center">
                        <div className="user-link">
                            <a href="/find">계정 찾기</a>
                            <a href="/reset-password">비밀번호 재설정</a>
                            <a href="/signup">회원가입</a>
                        </div>
                        <div>
                            <button type="submit" className="btn-sm user-btn">로그인</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
