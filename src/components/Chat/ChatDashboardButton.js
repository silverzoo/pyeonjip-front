// src/components/ChatDashboardButton/ChatDashboardButton.js
import React, { useState } from 'react';
import './ChatDashboardButton.css';
import ChatDashboard from './ChatDashboard';

function ChatDashboardButton() {
  const [showDashboard, setShowDashboard] = useState(false);

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
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