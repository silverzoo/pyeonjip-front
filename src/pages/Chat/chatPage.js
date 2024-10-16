import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatMessage from './ChatMessage';
import ChatRoomList from './ChatRoomList';
import useWebSocket from './UseWebSocket';
import './Chat.css';

const ChatPage = () => {
  const [chatRoomId, setChatRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [category, setCategory] = useState('');
  const [showNoHistoryMessage, setShowNoHistoryMessage] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [showSetup, setShowSetup] = useState(true);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [chatRooms, setChatRooms] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const categories = [
    "주문/환불 문의",
    "배송 문의",
    "파손 문의",
    "기타 문의",
    "이전 문의 내역"
  ];

  const handleCategorySelect = async (selectedCategory) => {
    setCategory(selectedCategory);
    console.log('Selected category:', selectedCategory);
  
    if (selectedCategory === '이전 문의 내역') {
      const userId = 1; // 실제 사용자 ID로 변경 필요
      try {
        const response = await fetch(`http://localhost:8080/api/chat/chat-room-list/${userId}`);
        const chatRooms = await response.json();
        setChatRooms(chatRooms);
        setShowSetup(false);
        setChatRoomId(null);
        setSelectedRoomId(null);
        setMessages([]);
        
        if (chatRooms.length === 0) {
          setShowNoHistoryMessage(true);
        } else {
          setShowNoHistoryMessage(false);
        }
      } catch (error) {
        console.error('Error fetching chat room list:', error);
      }
    } else {
      try {
        const response = await fetch('http://localhost:8080/api/chat/chat-room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: selectedCategory }),
        });
        if (!response.ok) throw new Error('Failed to create chat room');
        const data = await response.json();
        setChatRoomId(data.id);
        setSelectedRoomId(data.id);
        setMessages([]);
        setShowSetup(false);
        navigate(`/chat?chatRoomId=${data.id}`);
      } catch (error) {
        console.error('Error creating chat room:', error);
      }
    }
  };

  const handleMessageReceived = useCallback((message) => {
    console.log('Received message in ChatPage:', message);
    setMessages((prevMessages) => {
      // 임시 메시지 찾기
      const tempIndex = prevMessages.findIndex(msg => 
        msg.isTemp && msg.text === message.message
      );
      
      if (tempIndex !== -1) {
        // 임시 메시지를 서버 응답으로 업데이트
        const updatedMessages = [...prevMessages];
        updatedMessages[tempIndex] = {
          ...message,
          id: message.id,
          text: message.message,
          sent: true,
          received: false,
          isTemp: false
        };
        return updatedMessages;
      } else {
        // 새로운 메시지 추가 (서버에서 시작된 메시지의 경우)
        return [...prevMessages, {
          id: message.id,
          text: message.message,
          sent: false,
          received: true,
          fromServer: true
        }];
      }
    });
  }, []);

  const handleMessageUpdated = useCallback((updatedMessage) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === updatedMessage.id ? { ...msg, text: updatedMessage.message } : msg
      )
    );
  }, []);

  const handleMessageDeleted = useCallback((deletedMessageId) => {
    setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== deletedMessageId));
  }, []);

  const { sendMessage, updateMessage, deleteMessage } = useWebSocket(
    chatRoomId,
    handleMessageReceived, 
    handleMessageUpdated, 
    handleMessageDeleted  
  );

  const navigate = useNavigate();
  const location = useLocation();
  const contextMenuRef = useRef(null);
  const chatBodyRef = useRef(null);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomId = params.get('chatRoomId');
    if (roomId) {
      setChatRoomId(roomId);
      setShowSetup(false);
      loadChatMessages(roomId);
    } else {
      setShowSetup(true);
    }
  }, [location]);

  useEffect(() => {
    console.log('Messages:', messages); // messages 배열 확인
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRoomSelect = async (roomId) => {
    setSelectedRoomId(roomId);
    setChatRoomId(roomId);
    setCategory('선택된 이전 문의');
    await loadChatMessages(roomId);
  };
  
  const loadChatMessages = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/chat/chat-message-history/${roomId}`);
      if (!response.ok) throw new Error('Failed to load chat messages');
      const chatMessages = await response.json();
      console.log('Loaded messages:', chatMessages);
      setMessages(chatMessages);
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  const handleSendMessage = () => {
    const newMessage = messageInput.trim();
    if (newMessage !== "") {
      const tempMessage = {
        id: `temp-${Date.now()}`,
        text: newMessage,
        sent: true,
        received: false,
        isTemp: true
      };
      
      // 임시 메시지를 messages 상태에 즉시 추가
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      
      // WebSocket을 통해 메시지 전송
      sendMessage({
        chatRoomId: chatRoomId,
        message: newMessage,
      });
      
      setMessageInput("");
    }
  };

  const handleEditMessage = async (newMessage) => {
    if (selectedMessageId && newMessage.trim()) {
      try {
        await updateMessage(selectedMessageId, newMessage);
        setShowContextMenu(false);
      } catch (error) {
        console.error('Error editing message:', error);
      }
    }
  };

  const handleDeleteMessage = async () => {
    if (selectedMessageId) {
      try {
        await deleteMessage(selectedMessageId);
        setShowContextMenu(false);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const handleContextMenu = (e, messageId) => {
    e.preventDefault();
    const message = messages.find(msg => msg.id === messageId);
    if (message && message.sent) {
      console.log("Context menu triggered for message ID:", messageId);
      setSelectedMessageId(messageId);
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setShowContextMenu(true);
    }
  };

  return (
    <div className='chat-page-container'>
      {showSetup ? (
        <div className="chat-setup">
          <h2>문의 카테고리를 선택해주세요</h2>
          <div className="chat-category-buttons">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => handleCategorySelect(cat)}
                className="chat-category-button"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-header">편집에 문의하기</div>
            <div className="chat-body" ref={chatBodyRef}>
              {category === '이전 문의 내역' ? (
                <ChatRoomList 
                  chatRooms={chatRooms} 
                  onRoomSelect={handleRoomSelect}
                  showNoHistoryMessage={showNoHistoryMessage}
                />
              ) : (
                messages.map((msg, index) => (
                  <ChatMessage
                    key={msg.id || index}
                    message={msg}
                    onContextMenu={handleContextMenu}
                  />
                ))
              )}
            </div>
          {category !== '이전 문의 내역' && category !== '선택된 이전 문의' && (
            <div className="chat-input-container">
              <input
                type="text"
                placeholder="메시지를 입력하세요..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>전송</button>
            </div>
          )}
          {showContextMenu && (
            <div
              ref={contextMenuRef}
              className="context-menu"
              style={{
                position: 'fixed',
                top: `${contextMenuPosition.y}px`,
                left: `${contextMenuPosition.x}px`,
                background: 'white',
                border: '1px solid black',
                padding: '5px',
                zIndex: 1000,
              }}
            >
              <button onClick={() => {
                const newMessage = prompt('수정할 메시지를 입력하세요:');
                if (newMessage) handleEditMessage(newMessage);
              }}>
                메시지 수정
              </button>
              <button onClick={handleDeleteMessage}>메시지 삭제</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatPage;