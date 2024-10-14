import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatMessage from './ChatMessage';
import ChatRoomList from './ChatRoomList';
import useWebSocket from './useWebSocket';
import './chat.css';

const ChatPage = () => {
  const [chatRoomId, setChatRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [category, setCategory] = useState('');
  const [showNoHistoryMessage, setShowNoHistoryMessage] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [inputValue, setInputValue] = useState('');
  const [chatRooms, setChatRooms] = useState([]);
  
  const handleMessageReceived = useCallback((message) => {
    setMessages((prevMessages) => {
      const messageExists = prevMessages.some(msg => msg.id === message.id);
  
      // sent가 true인 경우 내가 보낸 메시지이므로 received로 처리하지 않음
      if (!messageExists && !message.sent) {
        return [...prevMessages, { ...message, received: true }];
      }
  
      return prevMessages;
    });
  }, []);

  const { sendMessage } = useWebSocket(chatRoomId, handleMessageReceived);

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

  // useEffect(() => {
  //   if (socket) {
  //     socket.onmessage = (event) => {
  //       const message = JSON.parse(event.data);
  //       console.log("Received message:", message); // 추가된 로그
  //       if (message.id && message.text) {
  //         setMessages((prevMessages) => [...prevMessages, message]);
  //       }
  //     };
  //   }
  // }, [socket]);

  const loadChatMessages = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/chat/chat-message-history/${roomId}`);
      if (!response.ok) throw new Error('Failed to load chat messages');
      const chatMessages = await response.json();
      setMessages(chatMessages);
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  const handleCreateRoom = async () => {
    console.log('Selected category:', category); // 현재 선택된 카테고리 로그
    if (category === '이전 문의 내역') {
      const userId = 1; // 실제 사용자 ID로 변경 필요
      try {
        const response = await fetch(`http://localhost:8080/api/chat/chat-room-list/${userId}`);
        const chatRooms = await response.json();
        setChatRooms(chatRooms);
        setShowSetup(false);
        
        if (chatRooms.length === 0) {
          setShowNoHistoryMessage(true); // 메시지 표시
        } else {
          setShowNoHistoryMessage(false); // 메시지 숨김
      // 메시지 로드 로직
    }
      } catch (error) {
        console.error('Error fetching chat room list:', error);
      }
    } else if (category) {
      try {
        const response = await fetch('http://localhost:8080/api/chat/chat-room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category }),
        });
        if (!response.ok) throw new Error('Failed to create chat room');
        const data = await response.json();
        setChatRoomId(data.id);
        setMessages([]); // 빈 메시지 배열 설정
        setShowSetup(false);
        navigate(`/chat?chatRoomId=${data.id}`);
      } catch (error) {
        console.error('Error creating chat room:', error);
      }
    } else {
      alert("카테고리를 선택해주세요.");
    }
  };
  
  // const handleSendMessage = async (message) => {
  //   if (message.trim() && chatRoomId && socket) {
  //     // WebSocket 객체가 올바른지 확인
  //     if (socket instanceof WebSocket) {
  //       const chatMessage = {
  //         chatRoomId,
  //         text: message,
  //       };
  
  //       // WebSocket으로 메시지 전송
  //       socket.send(JSON.stringify(chatMessage));
  
  //       // 전송한 메시지를 로컬에서 즉시 업데이트
  //       setMessages((prevMessages) => [...prevMessages, { id: Date.now(), text: message, sent: true }]);
  //       setInputValue('');
  
  //       // DB에 메시지 저장을 위한 fetch 요청
  //       try {
  //         const response = await fetch(`http://localhost:8080/api/chat/message?chatRoomId=${chatRoomId}`, {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'text/plain' },
  //           body: message,
  //         });
  //         if (!response.ok) throw new Error('Failed to send message');
  //         const data = await response.json();
  
  //         // 서버에서 응답받은 메시지 id로 로컬 메시지 업데이트
  //         setMessages((prevMessages) =>
  //           prevMessages.map((msg) => (msg.id === Date.now() ? { ...msg, id: data.id } : msg))
  //         );
  //       } catch (error) {
  //         console.error('Error saving message to the database:', error);
  //       }
  
  //       // 스크롤 아래로 자동 이동
  //       if (chatBodyRef.current) {
  //         chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  //       }
  //     } else {
  //       console.error('socket is not a WebSocket instance.');
  //     }
  //   }
  // };
  
  const handleSendMessage = (message) => {
    if (message.trim() && chatRoomId) {
      const newMessage = { id: Date.now(), text: message.trim(), sent: true };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      sendMessage(message.trim());
      setInputValue('');
  
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }
  };
  

  const handleEditMessage = async (newMessage) => {
    if (selectedMessageId && newMessage.trim()) {
      try {
        const response = await fetch(`http://localhost:8080/api/chat/message/${selectedMessageId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'text/plain' },
          body: newMessage,
        });
        if (!response.ok) throw new Error('Failed to edit message');
        const updatedMessage = await response.json();
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === selectedMessageId ? { ...msg, text: updatedMessage.message } : msg
          )
        );
        setShowContextMenu(false);
      } catch (error) {
        console.error('Error editing message:', error);
      }
    }
  };

  const handleDeleteMessage = async () => {
    if (selectedMessageId) {
      try {
        const response = await fetch(`http://localhost:8080/api/chat/message/${selectedMessageId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete message');
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== selectedMessageId));
        setShowContextMenu(false);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const handleContextMenu = (e, messageId) => {
    e.preventDefault();
    console.log("context menu triggered for message Id : ", messageId);
    setSelectedMessageId(messageId);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  return (
    <div>
      {showSetup ? (
        <div className="chat-setup">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">카테고리 선택</option>
            <option value="주문/환불 문의">주문/환불 문의</option>
            <option value="배송 문의">배송 문의</option>
            <option value="파손 문의">파손 문의</option>
            <option value="기타 문의">기타 문의</option>
            <option value="이전 문의 내역">이전 문의 내역</option>
          </select>
          <button onClick={handleCreateRoom}>문의 하기</button>
        </div>
      ) : (
        <div className="chat-container">
          <div className="header">편집에 문의하기</div>
          <div className="chat-body" ref={chatBodyRef}>
            <ChatRoomList 
              chatRooms={chatRooms} 
              onRoomSelect={(id) => {
                setChatRoomId(id);
                loadChatMessages(id); // 선택한 방의 메시지 로드
              }} 
            />
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onContextMenu={handleContextMenu}
              />
            ))}
          </div>
          <div className="input-container">
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={() => handleSendMessage(inputValue)}>전송</button>
          </div>
          {showContextMenu && (
            <div
              ref={contextMenuRef}
              className="context-menu"
              style={{
                position: 'absolute',
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