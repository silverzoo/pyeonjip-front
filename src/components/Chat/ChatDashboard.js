import React, { useState, useEffect } from 'react';
import './ChatDashboard.css';
import { fetchWithAuth } from '../../utils/authUtils'; // fetchWithAuth 함수 import

function ChatDashboard({ onClose, onRoomActivated  }) {
  console.log('ChatDashboard received onRoomActivated:', onRoomActivated);

  useEffect(() => {
    console.log('onRoomActivated:', onRoomActivated);
  }, [onRoomActivated]);

  const [waitingRooms, setWaitingRooms] = useState([]);

  useEffect(() => {
    fetchWaitingRooms();
  }, []);



  const fetchWaitingRooms = async () => {
    try {
      const data = await fetchWithAuth('http://localhost:8080/api/chat/waiting-rooms');
      console.log('Fetched waiting rooms:', data);
      setWaitingRooms(data);
    } catch (error) {
      console.error('Error fetching waiting rooms:', error);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      console.log('Joining room:', roomId);
      
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }
  
      const response = await fetch(`http://localhost:8080/api/chat/activate-room/${roomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`채팅방 활성화 실패: ${response.status} ${response.statusText}\n${errorText}`);
      }
  
      const activatedRoom = await response.json();
      console.log('Activated room:', activatedRoom);
  
      if (activatedRoom && activatedRoom.id && typeof onRoomActivated === 'function') {
        console.log('Calling onRoomActivated with room id:', activatedRoom.id);
        onRoomActivated(activatedRoom.id);
      } else {
        console.error('onRoomActivated is not a function or activatedRoom is invalid', onRoomActivated, activatedRoom);
        // 대체 로직: 직접 채팅방으로 이동
        window.location.href = `/chat?chatRoomId=${activatedRoom.id}`;
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('채팅방 입장에 실패했습니다: ' + error.message);
    }
  };


  return (
    <div className="chat-dashboard">
      <button className="chat-close-button" onClick={onClose}>&times;</button>
      <h2>대기 중인 채팅방</h2>
      {waitingRooms.map(room => (
        <div key={room.id} className="waiting-room-item">
          <span>{room.category} - {new Date(room.createdAt).toLocaleString()}</span>
          <button onClick={() => handleJoinRoom(room.id)}>입장</button>
        </div>
      ))}
    </div>
  );
}


export default ChatDashboard;