import React, { useState } from 'react';
import './ChatDashboardButton.css';
import { useAuth } from "../../context/AuthContext";
import ChatDashboard from './ChatDashboard';

function ChatDashboardButton() {
  const [showDashboard, setShowDashboard] = useState(false);
  const { isAdmin } = useAuth();

  const toggleDashboard = () => {
    if (isAdmin) {
      setShowDashboard(!showDashboard);
    } else {
      window.location.href = '/chat';  // isAdmin이 false면 /chat 페이지로 이동
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