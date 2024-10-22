import React, { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Chat.css';

const WaitingRoom = ({ room, onRoomActivated }) => {
  console.log('Rendering WaitingRoom with room:', room); 

  useEffect(() => {
    const token = localStorage.getItem('access');
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      onConnect: () => {
        console.log('Connected to WaitingRoom WebSocket');
        stompClient.subscribe(`/user/queue/chat-room-activated`, (message) => {
          const activatedRoom = JSON.parse(message.body);
          console.log('Received activated room:', activatedRoom);
          if (activatedRoom.id === room.id) {
            console.log('Calling onRoomActivated with:', activatedRoom.id);
            onRoomActivated(activatedRoom.id);
          }
        });
      }
    });

    stompClient.activate();
    
    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, [room.id, onRoomActivated]);

  return (
    <div className="chat-waiting-room">
      <div className="chat-loading-spinner"></div>
      <h2>대기 중</h2>
      <p>카테고리: {room.category}</p>
      <p>관리자가 곧 응답할 예정입니다. 잠시만 기다려주세요.</p>
    </div>
  );
};

export default WaitingRoom;