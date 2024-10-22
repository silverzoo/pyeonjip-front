import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const useWebSocket = (chatRoomId, onMessageReceived, onMessageUpdated, onMessageDeleted, userEmail) => {
  const [client, setClient] = useState(null);
  const navigate = useNavigate();
  const [currentRoom, setCurrentRoom] = useState(null);

  useEffect(() => {
    if (!chatRoomId || !userEmail) return;

    const token = localStorage.getItem('access');
    if (!token) {
      console.error('JWT 토큰이 없습니다.');
      return;
    }

    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
        chatRoomId: chatRoomId
      },
      onConnect: () => {
        console.log('STOMP connected');
        stompClient.subscribe(`/topic/messages/${chatRoomId}`, (message) => {
          console.log('Received message from server:', message.body);
          const receivedMessage = JSON.parse(message.body);
          if (typeof onMessageReceived === 'function' && receivedMessage.message) {
            onMessageReceived(receivedMessage);
          }
        });
        
        stompClient.subscribe(`/topic/message-updates/${chatRoomId}`, (update) => {
          console.log('Received message update:', update.body);
          const updatedMessage = JSON.parse(update.body);
          if (typeof onMessageUpdated === 'function') {
            onMessageUpdated(updatedMessage);
          }
        });

        stompClient.subscribe(`/topic/message-deletions/${chatRoomId}`, (deletion) => {
          console.log('Received message deletion:', deletion.body);
          const deletedMessageId = JSON.parse(deletion.body);
          if (typeof onMessageDeleted === 'function') {
            onMessageDeleted(deletedMessageId);
          }
        });

        stompClient.subscribe(`/topic/chat-room-closed/${chatRoomId}`, (message) => {
          const closedRoom = JSON.parse(message.body);
          // 상대방의 채팅방도 종료 처리
          setCurrentRoom(prev => ({...prev, status: 'CLOSED'}));
          navigate('/');
        });
      },

      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, [chatRoomId, onMessageReceived, onMessageUpdated, onMessageDeleted, userEmail]);

  const sendMessage = useCallback((message) => {
    if (client && client.active) {
      client.publish({
        destination: `/app/chat.sendMessage/${chatRoomId}`,
        body: JSON.stringify({ ...message, senderEmail: userEmail }),
      });
    }
  }, [client, chatRoomId, userEmail]);

  const updateMessage = useCallback((messageId, newText) => {
    if (client && client.active) {
      client.publish({
        destination: `/app/chat.updateMessage/${chatRoomId}`,
        body: JSON.stringify({ id: messageId, message: newText, senderEmail: userEmail }),
      });
    }
  }, [client, chatRoomId, userEmail]);

  const deleteMessage = useCallback((messageId) => {
    if (client && client.active) {
      client.publish({
        destination: `/app/chat.deleteMessage/${chatRoomId}`,
        body: JSON.stringify({ id: messageId, senderEmail: userEmail }),
      });
    }
  }, [client, chatRoomId, userEmail]);

  return { sendMessage, updateMessage, deleteMessage };
};

export default useWebSocket;