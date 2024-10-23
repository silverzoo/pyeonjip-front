import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../utils/authUtils";
import { reissueToken } from "../../utils/tokenUtils";
import axios from "axios"; // 토큰 재발급 함수 임포트

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

  // 이거 됨
  // const handleTokenAxiosReissue = async () => {
  //   try {
  //     const response = await axios.post('/api/auth/reissue', {}, { withCredentials: true });
  //
  //     const newAccessToken = response.headers.get('Authorization').split(' ')[1];
  //     localStorage.setItem('access', newAccessToken); // 새로운 액세스 토큰 저장
  //
  //     console.log('토큰이 성공적으로 재발급되었습니다.');
  //     return newAccessToken;
  //   } catch (error) {
  //     console.error('Token reissue failed:', error.message);
  //     alert('토큰 재발급에 실패했습니다.');
  //   }
  // };

  const handleTokenAxiosReissue = async () => {
    try {
      // 토큰 재발급 요청
      const response = await axios.post('/api/auth/reissue', {}, { withCredentials: true });

      // 응답 헤더 출력
      console.log('응답 헤더:', response.headers);

      // 새 액세스 토큰 추출
      const authorizationHeader = response.headers['Authorization'] || response.headers['authorization']; // 대소문자 대응
      if (authorizationHeader) {
        const newAccessToken = authorizationHeader.split(' ')[1];  // Bearer 부분을 분리
        localStorage.setItem('access', newAccessToken);  // 새로운 액세스 토큰 저장

        console.log('토큰이 성공적으로 재발급되었습니다.');
        return newAccessToken;  // 새 토큰 반환
      } else {
        throw new Error('Authorization 헤더가 없습니다.');
      }
    } catch (error) {
      console.error('Token reissue failed:', error.message);
      alert('토큰 재발급에 실패했습니다.');
      return null;  // 실패 시 null 반환
    }
  };

  return (
      <div className="user-container d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <button className="btn btn-danger" onClick={handleLogout}>
          로그아웃
        </button>
        <button className="btn btn-primary" onClick={handleTokenReissue} style={{marginLeft: '10px'}}>
          토큰 재발급하기
        </button>
        <button className="btn btn-primary" onClick={handleTokenAxiosReissue} style={{marginLeft: '10px'}}>
          엑시오스로 토큰 재발급하기
        </button>
      </div>
  );
}

export default Logout;
