import { useEffect, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const useWebSocket = (chatRoomId, onMessageReceived, onMessageUpdated, onMessageDeleted) => {
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
  }, [chatRoomId, onMessageReceived, onMessageUpdated, onMessageDeleted]);

  const sendMessage = useCallback((message) => {
    if (client && client.active) {
      client.publish({
        destination: `/app/chat.sendMessage/${chatRoomId}`,
        body: JSON.stringify(message),
      });
    }
  }, [client, chatRoomId]);

  const updateMessage = useCallback((messageId, newText) => {
    if (client && client.active) {
      client.publish({
        destination: `/app/chat.updateMessage/${chatRoomId}`,
        body: JSON.stringify({ id: messageId, message: newText }),
      });
    }
  }, [client, chatRoomId]);

  const deleteMessage = useCallback((messageId) => {
    if (client && client.active) {
      client.publish({
        destination: `/app/chat.deleteMessage/${chatRoomId}`,
        body: JSON.stringify({ id: messageId }),
      });
    }
  }, [client, chatRoomId]);

  return { sendMessage, updateMessage, deleteMessage };
};

export default useWebSocket;