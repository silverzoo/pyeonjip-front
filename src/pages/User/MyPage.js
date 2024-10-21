import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { getUserEmail, isLoggedIn } from '../../utils/authUtils';
import './User.css';

function MyPage() {
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('회원 정보');
    const [editField, setEditField] = useState('');
    const navigate = useNavigate();

    const fetchUser = async (email) => {
        try {
            console.log('요청 시작');
            // Axios 통신으로 인증 정보를 담아 요청
            const { data } = await axiosInstance.get(`/api/user/mypage?email=${email}`);
            setUser(data);
            console.log('데이터 가져오기 완료');
        } catch (error) {
            if (error.response?.status === 401) {
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
                endpoint = `/api/user/address/${email}`;  // baseURL이 axiosInstance에 설정되어 있으므로 상대 경로 사용함
                break;
            case 'password':
                updatedValue = prompt('새 비밀번호를 입력해주세요:');
                endpoint = `/api/user/password/${email}`;
                break;
            default:
                return;
        }

        // PUT 요청 보내기
        try {
            const response = await axiosInstance.put(endpoint, {
                [field]: updatedValue
            });

            if (response.status === 200) {
                alert(`${field}이(가) 성공적으로 수정되었습니다.`);
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
