import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../../logo.svg";

function SignUp() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordHint, setPasswordHint] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();

        if (!email || !name || !password || !passwordHint || !phoneNumber || !address) {
            setErrorMessage('모든 항목을 입력해주세요.');
            return;
        }

        const response = await fetch('http://localhost:8080/api/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name, password, passwordHint, phoneNumber, address }),
        });

        if (response.ok) {
            navigate('/signup/result', { state: { name, email } });
        } else {
            setErrorMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="container h-100 d-flex justify-content-center align-items-center">
            <div className="col-md-6">
                <div className="user-login-logo text-center mb-5">
                    <Link to="/"><img src={logo} alt="logo" width="140"/></Link>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <h3 className="text-left mb-2">회원가입</h3>
                    <div className="user-link">
                        <a href="#" onClick={handleBack} className="text-muted">뒤로가기</a>
                    </div>
                </div>
                <hr/>
                <form onSubmit={handleSignup}>
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
                    <div className="form-group mb-3">
                        <label htmlFor="passwordHint">비밀번호 힌트</label>
                        <input
                            type="text"
                            className="form-control user-form-control"
                            id="passwordHint"
                            value={passwordHint}
                            onChange={(e) => setPasswordHint(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="phoneNumber">전화번호</label>
                        <input
                            type="tel"
                            className="form-control user-form-control"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="address">주소</label>
                        <input
                            type="text"
                            className="form-control user-form-control"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            style={{marginBottom: '40px'}}
                        />
                    </div>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    <button type="submit" className="btn btn-sm user-btn btn-dark">회원가입</button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
