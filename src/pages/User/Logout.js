import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../utils/authUtils";
import { reissueToken } from "../../utils/tokenUtils"; // 토큰 재발급 함수 임포트

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error.message);
      alert('로그아웃에 실패했습니다.');
    }
  };

  const handleTokenReissue = async () => {
    try {
      const newToken = await reissueToken();
      if (newToken) {
        alert('토큰이 성공적으로 재발급되었습니다.');
      } else {
        alert('토큰 재발급에 실패했습니다.');
      }
    } catch (error) {
      console.error('Token reissue failed:', error.message);
      alert('토큰 재발급에 실패했습니다.');
    }
  };

  return (
      <div className="user-container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <button className="btn btn-danger" onClick={handleLogout}>
          로그아웃
        </button>
        <button className="btn btn-primary" onClick={handleTokenReissue} style={{ marginLeft: '10px' }}>
          토큰 재발급하기
        </button>
      </div>
  );
}

export default Logout;
