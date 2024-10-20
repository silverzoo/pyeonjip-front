import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ChatMessage from './ChatMessage';
import ChatRoomList from './ChatRoomList';
import WaitingRoom from './WaitingRoom';
import ActiveChatRoom from './ActiveChatRoom';
import useWebSocket from './UseWebSocket';
import ChatDashboard from '../../components/Chat/ChatDashboard';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Chat.css';

const ChatPage = () => {
  const [chatRoomId, setChatRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [category, setCategory] = useState('');
  const [chatRoomCategories, setChatRoomCategories] = useState({});
  const [showNoHistoryMessage, setShowNoHistoryMessage] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [showSetup, setShowSetup] = useState(true);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [chatRooms, setChatRooms] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isViewingChatRoom, setIsViewingChatRoom] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [showChatDashboard, setShowChatDashboard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [userRole, setUserRole] = useState('');

  const categories = [
    { name: "주문/환불 문의", icon: "bi-cash-stack" },
    { name: "배송 문의", icon: "bi-truck" },
    { name: "파손 문의", icon: "bi-hammer" },
    { name: "기타 문의", icon: "bi-person-raised-hand" },
    { name: "이전 문의 내역", icon: "bi-hourglass-bottom" }
  ];

  const handleOpenChatDashboard = () => {
    console.log('Opening chat dashboard');
    setShowChatDashboard(true);
  };

  const handleCloseChatDashboard = () => {
    console.log('Closing chat dashboard');
    setShowChatDashboard(false);
  };

  const handleCategorySelect = async (selectedCategory) => {
    setCategory(selectedCategory);
    console.log('Selected category:', selectedCategory);

    if (selectedCategory === '이전 문의 내역') {
      const userId = userEmail; // 실제 사용자 ID로 변경 필요
      try {
        const response = await fetch(`http://localhost:8080/api/chat/chat-room-list/${userId}`);
        const chatRoomsData = await response.json();
        setChatRooms(chatRoomsData);
        
        // 채팅방 ID와 카테고리를 매핑
        const categories = {};
        chatRoomsData.forEach(room => {
          categories[room.id] = room.category;
        });
        setChatRoomCategories(categories);

        setShowSetup(false);
        setChatRoomId(null);
        setSelectedRoomId(null);
        setMessages([]);
        
        if (chatRoomsData.length === 0) {
          setShowNoHistoryMessage(true);
        } else {
          setShowNoHistoryMessage(false);
        }
      } catch (error) {
        console.error('Error fetching chat room list:', error);
      }
    } else {
      try {
        setIsLoading(true);  // 로딩 상태 추가
        const response = await fetch('http://localhost:8080/api/chat/waiting-room', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
          },
          body: JSON.stringify({ category: selectedCategory }),
        });
        if (!response.ok) throw new Error('Failed to create waiting room');
        const data = await response.json();
        console.log('Created waiting room:', data);
        setCurrentRoom(data);
        setShowSetup(false);
        setIsViewingChatRoom(true);
      } catch (error) {
        console.error('Error creating waiting room:', error);
        alert('대기방 생성에 실패했습니다.');
      } finally {
        setIsLoading(false);  // 로딩 상태 해제
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
    handleMessageDeleted,
    userEmail  
  );

  const navigate = useNavigate();
  const location = useLocation();
  const contextMenuRef = useRef(null);
  const chatBodyRef = useRef(null);
  
  const loadChatMessages = useCallback(async (roomId) => {
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
  }, []);

  const handleRoomSelect = useCallback(async (roomId) => {
    try {
      console.log('Selecting room:', roomId);
      const response = await fetch(`http://localhost:8080/api/chat/chat-room/${roomId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` }
      });
      if (!response.ok) throw new Error('Failed to fetch chat room');
      const roomData = await response.json();
      console.log('Fetched room data:', roomData);
      setCurrentRoom(roomData);
      setChatRoomId(roomId);
      window.history.pushState(null, '', `/chat?chatRoomId=${roomId}`);
    } catch (error) {
      console.error('Error fetching chat room:', error);
      alert('채팅방 정보를 불러오는데 실패했습니다.');
    }
  }, []);

  

  const handleRoomActivated = useCallback((roomId) => {
    console.log('Room activated:', roomId);
    if (roomId) {
      setCurrentRoom(prevRoom => {
        if (prevRoom && prevRoom.id === roomId) return prevRoom;
        return { id: roomId, status: 'ACTIVE' };
      });
      setIsViewingChatRoom(true);
      setShowSetup(false);
      handleRoomSelect(roomId);
      setShowChatDashboard(false);
    } else {
      console.error('Invalid roomId received in handleRoomActivated');
    }
  }, [handleRoomSelect]);

  const handleHomeClick = () => {
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserEmail(decodedToken.email);
        setUserRole(decodedToken.role);
        console.log('User role:', decodedToken.role); // 로그 추가
      } catch (error) {
        console.error('토큰 디코딩 에러:', error);
      }
    } else {
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomId = params.get('chatRoomId');
    if (roomId) {
      setShowSetup(false);
      handleRoomSelect(roomId);
    } else {
      setShowSetup(true);
    }
  }, [location.search, handleRoomSelect]);


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



  useEffect(() => {
    console.log('handleRoomActivated updated:', handleRoomActivated);
  }, [handleRoomActivated]);

  const handleBackToList = () => {
    setIsViewingChatRoom(false);
    setCategory('이전 문의 내역');
    setSelectedRoomId(null);
    setChatRoomId(null);
    setMessages([]);
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
        senderEmail: userEmail
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

  const shouldShowInputContainer = () => {
    return currentRoom && currentRoom.status === 'ACTIVE';
  };

  useEffect(() => {
    console.log('Current state:', {
      category,
      showSetup,
      currentRoom,
      isViewingChatRoom
    });
  }, [category, showSetup, currentRoom, isViewingChatRoom]);

  useEffect(() => {
    if (currentRoom && currentRoom.status === 'ACTIVE') {
      setShowSetup(false);
      setIsViewingChatRoom(true);
      loadChatMessages(currentRoom.id);
    }
  }, [currentRoom, loadChatMessages]);

  return (
    <div className='chat-page-container'>
    {userRole === 'ADMIN' && (
      <button onClick={handleOpenChatDashboard}>채팅 대시보드 열기</button>
    )}
    {showChatDashboard && (
      <ChatDashboard 
        onClose={handleCloseChatDashboard} 
        onRoomActivated={handleRoomActivated}
      />
    )}
    {isLoading ? (
      <div>Loading...</div>
    ) : showSetup ? (
      <div className="chat-setup">
        <h2>문의 카테고리를 선택해주세요</h2>
        <div className="chat-category-buttons">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => handleCategorySelect(cat.name)}
              className="chat-category-button"
            >
              <i className={`bi ${cat.icon}`}></i>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    ) : currentRoom ? (
        <div className="chat-container">
          <div className="chat-header">
            <button className="chat-back-button" onClick={handleBackToList}>
              <i className="bi bi-chevron-left"></i>
            </button>
            <span>{category}</span>
            <button className="chat-home-button" onClick={handleHomeClick} aria-label="홈으로 이동">
              <i className="bi bi-house-fill"></i>
            </button>
          </div>
  
          <div className="chat-body" ref={chatBodyRef}>
            {currentRoom.status === 'WAITING' ? (
              <WaitingRoom room={currentRoom} onRoomActivated={handleRoomActivated} />
            ) : (
              <ActiveChatRoom
                room={currentRoom}
                messages={messages}
                onSendMessage={handleSendMessage}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                onContextMenu={handleContextMenu}
              />
            )}
          </div>
          
          {shouldShowInputContainer() && (
            <div className="chat-input-container">
              <input
                type="text"
                placeholder="메시지를 입력하세요..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage} 
                className="chat-send-button"
                aria-label="메시지 전송"
              >
                <i className="bi bi-send-fill"></i>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="chat-context-menu"
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
  );
};

export default ChatPage;