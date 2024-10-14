import React from 'react';

const ChatMessage = ({ message, onContextMenu }) => {
  return (
    <div 
      className={`message ${message.sent ? 'sent' : 'received'}`}
      onContextMenu={(e) => {
        e.preventDefault();
        console.log("Context menu triggered for message ID:", message.id);
        onContextMenu(e, message.id);
      }}
    >
      {message.text}
    </div>

  );
};

export default ChatMessage;