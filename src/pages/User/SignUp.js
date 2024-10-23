import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../../logo.svg";

function SignUp() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    // 전화번호 필드를 세 개로 나눔
    const [phoneNumberPart1, setPhoneNumberPart1] = useState('');
    const [phoneNumberPart2, setPhoneNumberPart2] = useState('');
    const [phoneNumberPart3, setPhoneNumberPart3] = useState('');
    const [address, setAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();

        // 모든 필드를 확인
        if (!email || !name || !password || !phoneNumberPart1 || !phoneNumberPart2 || !phoneNumberPart3 || !address) {
            setErrorMessage('모든 항목을 입력해주세요.');
            return;
        }

        // 전화번호를 세 파트로 나눈 값을 결합하여 하나의 전화번호로 만듦
        const phoneNumber = `${phoneNumberPart1}${phoneNumberPart2}${phoneNumberPart3}`;

        const response = await fetch('http://localhost:8080/api/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name, password, phoneNumber, address }),
        });

        if (response.ok) {
            navigate('/signup/result', { state: { name, email } });
        } else if (response === 409) {
            // Todo: 예외처리 손보기
            setErrorMessage('중복')
        }

        else {
            // 경고창을 띄움
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
                    {/* 전화번호 필드를 세 개로 나눔 */}
                    <div className="form-group mb-3">
                        <label htmlFor="phoneNumber">전화번호</label>
                        <div className="d-flex">
                            <input
                                type="text"
                                className="form-control"
                                value={phoneNumberPart1}
                                onChange={(e) => setPhoneNumberPart1(e.target.value)}
                                maxLength={3}
                                required
                                style={{ width: '100px', marginRight: '5px' }}
                            />
                            <input
                                type="text"
                                className="form-control"
                                value={phoneNumberPart2}
                                onChange={(e) => setPhoneNumberPart2(e.target.value)}
                                maxLength={4}
                                required
                                style={{ width: '120px', marginRight: '5px' }}
                            />
                            <input
                                type="text"
                                className="form-control"
                                value={phoneNumberPart3}
                                onChange={(e) => setPhoneNumberPart3(e.target.value)}
                                maxLength={4}
                                required
                                style={{ width: '120px' }}
                            />
                        </div>
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
                            style={{ marginBottom: '40px' }}
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
