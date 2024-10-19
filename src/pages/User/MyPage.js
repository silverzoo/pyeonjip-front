import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth, getUserEmail, isLoggedIn } from '../../utils/authUtils';
import './User.css'; // MyPage.css는 User.css로 변경

function MyPage() {
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('회원 정보');
    const [editField, setEditField] = useState(''); // 어떤 필드를 수정할지 추적
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

        // 이메일 값을 가져옴
        const email = getUserEmail();

        // 업데이트할 데이터
        let updatedValue;
        switch (field) {
            case 'address':
                updatedValue = user.address;
                break;
            case 'password':
                updatedValue = prompt('새 비밀번호를 입력해주세요:'); // 비밀번호는 별도로 입력받음
                break;
            default:
                return;
        }

        // PUT 요청 보내기
        try {
            const response = await fetchWithAuth(`http://localhost:8080/api/user/information/${email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: updatedValue }),
            });

            if (response.ok) {
                alert(`${field}이(가) 성공적으로 수정되었습니다.`);
                // 변경 후 사용자 정보 다시 로드
                fetchUser(email);
            } else {
                alert('수정하는 중 문제가 발생했습니다.');
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
        <div className="user-container h-100 d-flex justify-content-center align-items-center">
            <div className="col-md-6">
                <h3 className="text-left mb-2">마이페이지</h3>
                <hr/>
                <div className="tab-container user-tab-container mb-3">
                    {['회원 정보', '구매 내역', '나의 등급'].map(tab => (
                        <button
                            key={tab}
                            className={`btn ${activeTab === tab ? 'btn-dark' : 'btn-light'} me-2`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <hr/>
                <div className="content-container">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default MyPage;
