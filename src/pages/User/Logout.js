import React from 'react';
import { useNavigate } from 'react-router-dom';
import {logout} from "../../utils/authUtils";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async (navigate) => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error.message);
      alert('로그아웃에 실패했습니다.');
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
