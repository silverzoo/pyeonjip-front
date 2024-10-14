import { useEffect, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const useWebSocket = (chatRoomId, onMessageReceived) => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!chatRoomId) return;

    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        chatRoomId: chatRoomId
      },
      onConnect: () => {
        console.log('STOMP connected');
        stompClient.subscribe(`/topic/messages/${chatRoomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          if (typeof onMessageReceived === 'function') {
            // 서버로부터 받은 메시지에 'received' 플래그 추가
            onMessageReceived({ ...receivedMessage, received: true });
          } else {
            console.error('onMessageReceived is not a function');
          }
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
  }, [chatRoomId, onMessageReceived]);

  const sendMessage = useCallback((message) => {
    if (client && client.active) {
      const messageObject = {
        chatRoomId: chatRoomId,
        message: message,  // 'text' 대신 'message' 사용
        // 'sent' 및 'id' 필드 제거
      };
      
      client.publish({
        destination: `/app/chat.sendMessage/${chatRoomId}`,
        body: JSON.stringify(messageObject),
      });
      
      // 로컬에 즉시 메시지 추가하는 부분 제거
      // onMessageReceived(messageObject);
    }
  }, [client, chatRoomId]);

  return { sendMessage };
};

export default useWebSocket;