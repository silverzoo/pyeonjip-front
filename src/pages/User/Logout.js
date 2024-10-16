import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/');
      } else {
        alert('로그아웃에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <div className="user-container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <button className="btn btn-danger" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}

export default Logout;
