import React from 'react';

const ChatRoomList = ({ chatRooms, onRoomSelect, showNoHistoryMessage }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Seoul'
    };
    return new Intl.DateTimeFormat('ko-KR', options).format(date);
  };

  if (showNoHistoryMessage) {
    return <div>이전 문의 내역이 없습니다.</div>;
  }

  return (
    <div className="chat-room-list">
      {chatRooms.map((room) => (
        <div key={room.id} className="chat-room-item" onClick={() => onRoomSelect(room.id)}>
          <div className="chat-room-date">{formatDate(room.createdAt)}</div>
          <div className="chat-room-category">{room.category}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList;