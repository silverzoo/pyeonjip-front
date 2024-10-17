import React, { useState, useEffect } from 'react';
// import jwtDecode from 'jwt-decode'; // 현재는 사용하지 않는 import문
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function MyPage() {
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 로컬 스토리지에서 토큰을 꺼내서, 마이페이지를 조회할 email 추출하는 과정
    const getEmailFromToken = () => {
        try {
            const token = localStorage.getItem('access');
            if (token) {
                // JWT 가져오기
                const decodedToken = jwtDecode(token);
                // JWT에서 email 추출
                return decodedToken.email;
            } else {
                throw new Error('토큰이 없습니다.');
            }
        } catch (error) {
            console.error('토큰 디코딩 오류:', error);
            setErrorMessage('로그인이 필요합니다.');
            navigate('/login');
            return null;
        }
    };

    const fetchUser = async (email) => {
        try {
            const response = await fetch(`http://localhost:8080/api/user/mypage?email=${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else if (response.status === 403 || response.status === 401) {
                setErrorMessage('로그인이 필요합니다.');
                navigate('/login');
            } else {
                setErrorMessage('유저 정보를 불러오는 데 실패했습니다.');
            }
        } catch (error) {
            setErrorMessage('서버와 통신하는 데 문제가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const email = getEmailFromToken();
        if (email) {
            fetchUser(email);
        }
    }, []);

    return (
        <div className="user-container h-100 d-flex justify-content-center align-items-center">
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
