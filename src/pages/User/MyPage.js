import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth, getUserEmail, isLoggedIn } from '../../utils/authUtils';
import './User.css'; // MyPage.css는 User.css로 변경

function MyPage() {
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('회원 정보');
    const [editField, setEditField] = useState('');
    const navigate = useNavigate();

    const fetchUser = async (email) => {
        try {
            const data = await fetchWithAuth(`http://localhost:8080/api/user/mypage?email=${email}`);
            setUser(data);
        } catch (error) {
            if (error.message === '토큰이 유효하지 않습니다. 로그인이 필요합니다.') {
                setErrorMessage('로그인이 필요합니다.');
                navigate('/login');
            } else {
                setErrorMessage('유저 정보를 불러오는 데 실패했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoggedIn()) {
            setErrorMessage('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        const email = getUserEmail();
        if (email) {
            fetchUser(email);
        } else {
            setErrorMessage('유저 정보를 불러오는 데 실패했습니다.');
            setLoading(false);
        }
    }, [navigate]);

    const handleEdit = async (field) => {
        setEditField(field);

        const email = getUserEmail();

        let updatedValue;
        let endpoint;
        switch (field) {
            case 'address':
                updatedValue = user.address;
                endpoint = `http://localhost:8080/api/user/address/${email}`;
                break;
            case 'password':
                updatedValue = prompt('새 비밀번호를 입력해주세요:');
                endpoint = `http://localhost:8080/api/user/password/${email}`;
                break;
            default:
                return;
        }

        // PUT 요청 보내기
        try {
            const response = await fetchWithAuth(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: updatedValue }),
            });

            if (response.ok) {
                const success = await response.json();
                if (success) {
                    alert(`${field}이(가) 성공적으로 수정되었습니다.`);
                    fetchUser(email);
                } else {
                    alert('수정하는 중 문제가 발생했습니다.1');
                }
            } else {
                alert('수정하는 중 문제가 발생했습니다.2');
            }
        } catch (error) {
            console.error('수정 요청 중 오류 발생:', error);
            alert('수정 요청에 실패했습니다.');
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case '회원 정보':
                return (
                    <div>
                        <div className="form-group mb-3">
                            <label htmlFor="email">이메일</label>
                            <div className="input-group">
                                <input type="email" className="form-control user-form-control" id="email" value={user.email} disabled />
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="name">이름</label>
                            <div className="input-group">
                                <input type="text" className="form-control user-form-control" id="name" value={user.name} disabled />
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="phoneNumber">전화번호</label>
                            <div className="input-group">
                                <input type="tel" className="form-control user-form-control" id="phoneNumber" value={user.phoneNumber} disabled />
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="address">주소</label>
                            <div className="input-group">
                                <input type="text" className="form-control user-form-control" id="address" value={user.address} onChange={(e) => setUser({ ...user, address: e.target.value })} />
                                <div className="input-group-append">
                                    <button className="btn btn-sm user-btn" onClick={() => handleEdit('address')}>변경</button>
                                </div>
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">비밀번호</label>
                            <div className="input-group">
                                <input type="password" className="form-control user-form-control" id="password" value="••••••••" disabled />
                                <div className="input-group-append">
                                    <button className="btn btn-sm user-btn" onClick={() => handleEdit('password')}>변경</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case '구매 내역':
                return <p>구매 내역 내용</p>;
            case '나의 등급':
                return <p>나의 등급 정보</p>;
            default:
                return null;
        }
    };

    if (loading) return <p>유저 정보를 불러오는 중입니다...</p>;
    if (errorMessage) return <p className="text-danger">{errorMessage}</p>;

    return (
        <div className="user-mypage-container">
            <div className="user-mypage-content">
                <div className="user-header">
                    <h3 className="text-left mb-2">마이페이지</h3>
                </div>
                <div className="user-body">
                    <hr/>
                    <div className="tab-container user-tab-container">
                        {['회원 정보', '구매 내역', '나의 등급'].map((tab, index) => (
                            <React.Fragment key={tab}>
                                <button
                                    className={`btn ${activeTab === tab ? 'btn-dark' : 'btn-light'}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                                {index < 2 && <div className="tab-divider"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                    <hr/>
                    <div className="user-content-container">
                        {loading ? (
                            <p>유저 정보를 불러오는 중입니다...</p>
                        ) : errorMessage ? (
                            <p className="text-danger">{errorMessage}</p>
                        ) : (
                            renderContent()
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyPage;
