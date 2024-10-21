import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './User.css';
import {syncWithLocal} from "../../utils/cartUtils";
import {useAuth} from "../../context/AuthContext";
import logo from "../../logo.svg";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { handleContextLogin } = useAuth();

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

        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include' // 쿠키 사용 시 필요
        });

        if (response.ok) {
            // 응답 헤더에서 access 토큰 꺼내기
            const accessToken = response.headers.get('Authorization');
            if (accessToken && accessToken.startsWith('Bearer ')) {
                localStorage.setItem('access', accessToken.split(' ')[1]); // access 토큰 로컬 스토리지에 저장

                // 로그인 성공 시 서버 Cart 동기화 및 로컬스토리지 초기화
                handleContextLogin(); // 로그인 상태 업데이트
                syncWithLocal();
                localStorage.removeItem('cart');


                // 로그인 후 이전페이지로 리다이렉트
                // 단, restrictedPages 내의 URL에 해당되면 홈으로 리다이렉트
                const restrictedPages = ['/signup/result'];
                const fromPage = location.state?.from || '/';  // 이전 페이지 경로
                if (!restrictedPages.includes(fromPage)) {
                    navigate(fromPage);
                } else {
                    navigate("/");  // 예외 페이지일 경우 메인 페이지로 리다이렉트
                }


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
        navigate("/");
    };

    // 이벤트 리스너 추가
    useEffect(() => {
        const handleAuthChange = () => {
        };
        window.addEventListener('authChange', handleAuthChange);
        return () => {
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    return (
        <div className="login-container d-flex flex-column align-items-center justify-content-start vh-100 card border-0">
            <div className="user-login-container">
                <div className="user-login-logo text-center mb-5">
                    <Link to="/"><img src={logo} alt="logo" width="180"/></Link>
                </div>
                <div className="text-center">
                    <h5 className="user-login-text mb-3 fw-semibold">나의 공간을 '편집'</h5>
                </div>
                <form onSubmit={handleLogin} className="d-flex flex-column">
                    <input
                        type="email"
                        className="form-control user-form-control mb-3"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="form-control user-form-control mb-4"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errorMessage && <p className="text-danger mb-3">{errorMessage}</p>}
                    <button type="submit" className="btn user-login-btn mb-4">로그인</button>
                </form>
                <div className="d-flex justify-content-between mb-5">
                    <Link to="/find" className="user-link">계정 찾기</Link>
                    <Link to="/reset" className="user-link">비밀번호 재설정</Link>
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

export default Login;
