import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth, getUserEmail, isLoggedIn } from '../../utils/authUtils'; // 유틸 함수 import

function MyPage() {
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 유저 정보를 가져오는 함수
    const fetchUser = async (email) => {
        try {
            // Util의 fetchWithAuth를 사용해서 API를 요청
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
        // 1. 로그인 상태 확인
        if (!isLoggedIn()) {
            setErrorMessage('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        // 2. 이메일 추출
        const email = getUserEmail();
        if (email) {
            fetchUser(email);
        } else {
            setErrorMessage('유저 정보를 불러오는 데 실패했습니다.');
            setLoading(false);
        }
    }, [navigate]);

    return (
        <div className="user-container h-100 d-flex justify-content-center align-items-center card vh-100 border-0">
            <div className="col-md-6 user-form">
                <h3 className="text-left mb-2">내 정보</h3>
                <hr />
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                {loading ? (
                    <p>유저 정보를 불러오는 중입니다...</p>
                ) : (
                    user && (
                        <div>
                            <p><strong>이름:</strong> {user.name}</p>
                            <p><strong>이메일:</strong> {user.email}</p>
                            <p><strong>전화번호:</strong> {user.phoneNumber}</p>
                            <p><strong>주소:</strong> {user.address}</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default MyPage;
