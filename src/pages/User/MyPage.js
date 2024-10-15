import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function MyPage() {
    const { userId } = useParams(); // URL에서 userId를 추출
    const [user, setUser] = useState(null); // 유저 정보를 저장할 상태
    const [errorMessage, setErrorMessage] = useState('');

    // 유저 정보를 API로부터 가져오는 함수
    const fetchUser = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                setErrorMessage('유저 정보를 불러오는 데 실패했습니다.');
            }
        } catch (error) {
            setErrorMessage('서버와 통신하는 데 문제가 발생했습니다.');
        }
    };

    // 컴포넌트가 마운트될 때 유저 정보를 가져옴
    useEffect(() => {
        fetchUser();
    }, [userId]);

    return (
        <div className="user-container h-100 d-flex justify-content-center align-items-center">
            <div className="col-md-6 user-form">
                <h3 className="text-left mb-2">내 정보</h3>
                <hr />
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                {user ? (
                    <div>
                        <p><strong>이름:</strong> {user.name}</p>
                        <p><strong>이메일:</strong> {user.email}</p>
                        <p><strong>전화번호:</strong> {user.phoneNumber}</p>
                        <p><strong>주소:</strong> {user.address}</p>
                    </div>
                ) : (
                    !errorMessage && <p>유저 정보를 불러오는 중입니다...</p>
                )}
            </div>
        </div>
    );
}

export default MyPage;
