import React from 'react';

const ChatMessage = ({ message, onContextMenu }) => {
  let messageClass = message.sent ? 'chat-message sent' : 'chat-message received';
  
  return (
    <div 
      className={messageClass}
      onContextMenu={(e) => onContextMenu(e, message.id)}
    >
      {message.text}
    </div>
  );
};

export default ChatMessage;