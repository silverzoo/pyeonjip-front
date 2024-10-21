import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { getUserEmail, isLoggedIn } from '../../utils/authUtils';
import './User.css';
import './MyPage.css'

function MyPage() {
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('회원 정보');
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [gradeInfo, setGradeInfo] = useState(null);
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

    // 구매 내역을 가져오는 함수
    const fetchPurchaseHistory = async (email) => {
        try {
            const { data } = await axiosInstance.get(`/api/orders?email=${email}`);
            setPurchaseHistory(data);
        } catch (error) {
            setPurchaseHistory([]);
        }
    };

    // 나의 등급을 가져오는 함수
    const fetchUserGrade = async (email) => {
        try {
            const { data } = await axiosInstance.get(`/api/user/${email}`);
            setGradeInfo(data);
        } catch (error) {
            setErrorMessage('등급 정보를 가져오는 중 오류가 발생했습니다.');
        }
    };

    // 탭에 따라 데이터를 가져오는 함수
    const fetchDataByTab = (email) => {
        if (activeTab === '구매 내역') {
            fetchPurchaseHistory(email);
        } else if (activeTab === '나의 등급') {
            fetchUserGrade(email);
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
            fetchDataByTab(email);
        } else {
            setErrorMessage('유저 정보를 불러오는 데 실패했습니다.');
            setLoading(false);
        }
    }, [navigate, activeTab]);

    const handleEdit = async (field) => {
        const email = getUserEmail();
        // setEditField(field);

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

// 가격 포맷 함수 
  const formatPriceWithWon = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

    // 구매 내역 렌더링 함수
const renderPurchaseHistory = () => (
    <div>
        <table className="custom-table">
            <thead>
                <tr>
                    <th>상품</th>
                    <th>상품명</th>
                    <th>수량</th>
                    <th>금액</th>
                    <th>주문상태</th>
                    <th>배송상태</th>
                    <th>주문일자</th>
                </tr>
            </thead>
            <tbody>
                {purchaseHistory.length > 0 ? (
                    purchaseHistory.map((order) =>
                        order.orderDetails.map((item) => (
                            <tr key={`${order.id}-${item.productDetailId}`}>
                                <td>
                                    <img
                                        src={item.productImage}
                                        alt={item.productName}
                                        style={{ width: '80px', height: '80px' }}
                                    />
                                </td>
                                <td>{item.productName}</td>
                                <td>{item.quantity}</td>
                                <td>{formatPriceWithWon(item.subTotalPrice)}</td>
                                <td>{order.orderStatus}</td>
                                <td>{order.deliveryStatus}</td>
                                <td>{order.createdAt}</td>
                            </tr>
                        ))
                    )
                ) : (
                    <tr>
                        <td colSpan="7" style={{ textAlign: 'center' }}>구매 내역이 없습니다.</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

    // 나의 등급 렌더링 함수
    const renderUserGrade = () => (
        <div style={{ fontWeight: 'bold' }}>
            {gradeInfo ? (
                <p>
                    {user.name}님의 현재 등급은
                    <span style={{ color: 'lightgreen', textDecoration: 'underline' }}> {gradeInfo.grade} </span>
                    입니다.
                    <div className="grade-benefits">
                        <h6 style={{ fontSize: '0.9rem', textDecoration: 'underline' }}>등급 혜택 안내</h6>
                        <p>최고의 고객님들께 드리는 특별 혜택을 만나보세요.</p>

                        <ul>
                            <li>
                                <strong>🥇 GOLD 등급</strong> <br />
                                <span>누적 구매 금액이 <strong>3,000,000원</strong> 이상일 때 GOLD 등급으로 승급됩니다.</span><br />
                                <span>GOLD 등급 고객님은 <strong>무료 배송</strong> 혜택과 함께 <strong>모든 상품 10% 할인</strong>을 적용받으실 수 있습니다.</span><br />
                            </li>
                            <li style={{ marginTop: '20px' }}>
                                <strong>🥈 SILVER 등급</strong> <br />
                                <span>누적 구매 금액이 <strong>2,000,000원</strong> 이상일 때 SILVER 등급으로 승급됩니다.</span><br />
                                <span>SILVER 등급 고객님은 <strong>모든 상품 5% 할인</strong> 혜택을 적용받으실 수 있습니다.</span>
                            </li>
                        </ul>

                        <div className="grade-note">
                            <p><em>등급은 누적 구매 금액에 따라 자동으로 승급됩니다.</em></p>
                        </div>
                    </div>
                </p>
            ) : (
                <p>등급 정보를 불러오는 중입니다...</p>
            )}
        </div>
    );

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
                return renderPurchaseHistory();
            case '나의 등급':
                return renderUserGrade();
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
                    <hr />
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
                    <hr />
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
