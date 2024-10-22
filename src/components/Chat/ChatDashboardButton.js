import React, { useState } from 'react';
import './ChatDashboardButton.css';
import { useAuth } from "../../context/AuthContext";
import ChatDashboard from './ChatDashboard';

function ChatDashboardButton() {
  const [showDashboard, setShowDashboard] = useState(false);
  const { isAdmin, isLoggedIn } = useAuth();

  const toggleDashboard = () => {
    if(isLoggedIn){
      if (isAdmin) {
        setShowDashboard(!showDashboard);
      } else {
        window.location.href = '/chat';  // isAdmin이 false면 /chat 페이지로 이동
      }
    }else{
        alert("로그인이 필요한 서비스입니다.");
        window.location.href = '/login';
    }
  };

  return (
    <>
      <button className="chat-dashboard-button" onClick={toggleDashboard}>
        <i className="bi bi-chat-dots"></i>
      </button>
      {showDashboard && <ChatDashboard onClose={() => setShowDashboard(false)} />}
    </>
  );
}

export default ChatDashboardButton;