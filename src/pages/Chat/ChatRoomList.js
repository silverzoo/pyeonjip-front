import React from 'react';

const ChatRoomList = ({ chatRooms, onRoomSelect, showNoHistoryMessage }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="chat-room-list">
      {showNoHistoryMessage ? ( // 새로운 상태를 사용하도록 변경
        <p>이전 문의 내역이 없습니다.</p>
      ) : (
        chatRooms.map((room) => (
          <div key={room.id} className="chat-room" onClick={() => onRoomSelect(room.id)}>
            <p>문의 일시: {formatDate(room.createdAt)}, 문의사항: {room.category}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatRoomList;