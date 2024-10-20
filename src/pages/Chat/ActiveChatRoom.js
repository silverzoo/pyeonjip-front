import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

const ActiveChatRoom = ({ room, messages, onSendMessage, onEditMessage, onDeleteMessage, onContextMenu }) => {
  const [messageInput, setMessageInput] = useState('');
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="active-chat-room">
      <div className="chat-messages" ref={chatBodyRef}>
        {messages.map((msg, index) => (
          <ChatMessage
            key={msg.id || index}
            message={msg}
            onEdit={onEditMessage}
            onDelete={onDeleteMessage}
            onContextMenu={onContextMenu}
          />
        ))}
      </div>
      {/* ... */}
    </div>
  );
};

export default ActiveChatRoom;