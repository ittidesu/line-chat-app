import React, { useState, useEffect } from 'react';
import './ChatScreen.css';

function ChatScreen({ chat, currentUser, onBack, onSendMessage, onMarkAsRead, onBlockUser, onDeleteFriend }) {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(chat.messages || []);
  const [showMenu, setShowMenu] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [otherUserOnline, setOtherUserOnline] = useState(true);

  const otherUsername = chat.participants.find(p => p !== currentUser.username);

  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    
    const newMessage = {
      id: Math.random(),
      sender: currentUser.username,
      content: messageInput,
      timestamp: new Date(),
      read: false,
      readBy: [],
      edited: false
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput('');
    onSendMessage(messageInput);
  };

  const handleEditMessage = (messageId, content) => {
    if (messageInput.trim() === '') return;
    
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: editingContent, edited: true, editedAt: new Date() }
        : msg
    ));
    setEditingMessageId(null);
    setEditingContent('');
  };

  const handleDeleteMessage = (messageId) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
  };

  const handleMarkAsRead = (messageId) => {
    if (messages.find(m => m.id === messageId)?.sender !== currentUser.username) {
      setMessages(messages.map(msg => {
        if (msg.id === messageId && msg.sender !== currentUser.username) {
          return { ...msg, read: true, readAt: new Date() };
        }
        return msg;
      }));
      onMarkAsRead(chat.id, messageId);
    }
  };

  const handleBlockUser = () => {
    if (window.confirm(`${otherUsername} をブロックしますか？`)) {
      onBlockUser(otherUsername);
      alert('ブロックしました');
    }
  };

  const handleDeleteFriend = () => {
    if (window.confirm(`${otherUsername} を友達から削除しますか？`)) {
      onDeleteFriend(otherUsername);
      onBack();
    }
  };

  useEffect(() => {
    // Mark all messages as read when viewing the chat
    messages.forEach(msg => {
      if (msg.sender !== currentUser.username && !msg.read) {
        handleMarkAsRead(msg.id);
      }
    });
  }, []);

  return (
    <div className="chat-screen">
      {/* Chat Header */}
      <div className="chat-header">
        <button className="back-button" onClick={onBack}>←</button>
        <div className="chat-header-info">
          <h2>{otherUsername}</h2>
          {chat.isGroupChat && (
            <p className="group-member-count">
              {chat.participants.length}人がオンライン
            </p>
          )}
          {!otherUserOnline && (
            <p className="offline-status">相手はログアウトしました</p>
          )}
        </div>
        <div className="chat-header-actions">
          <button className="menu-button" onClick={() => setShowMenu(!showMenu)}>−</button>
          {showMenu && (
            <div className="menu-dropdown">
              <button onClick={handleBlockUser}>ブロック</button>
              <button onClick={handleDeleteFriend}>削除</button>
            </div>
          )}
          {chat.isGroupChat && (
            <button className="sos-button" title="SOS">🆘</button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map(message => (
          <div
            key={message.id}
            className={`message ${message.sender === currentUser.username ? 'sent' : 'received'}`}
            onClick={() => !chat.isGroupChat && message.sender !== currentUser.username && handleMarkAsRead(message.id)}
          >
            <div className="message-content">
              {editingMessageId === message.id ? (
                <div className="message-edit">
                  <input
                    type="text"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    autoFocus
                  />
                  <button onClick={() => handleEditMessage(message.id, editingContent)}>保存</button>
                  <button onClick={() => setEditingMessageId(null)}>キャンセル</button>
                </div>
              ) : (
                <>
                  <p>{message.content}</p>
                  {message.edited && <span className="edited-tag">(編集済み)</span>}
                </>
              )}
            </div>
            {message.sender === currentUser.username && (
              <div className="message-actions">
                <button onClick={() => {
                  setEditingMessageId(message.id);
                  setEditingContent(message.content);
                }}>編集</button>
                <button onClick={() => handleDeleteMessage(message.id)}>削除</button>
              </div>
            )}
            {message.read && message.sender !== currentUser.username && (
              <span className="read-status">既読 {new Date(message.readAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            )}
            {message.sender !== currentUser.username && !message.read && (
              <span className="unread-indicator">未読</span>
            )}
            {chat.isGroupChat && message.read && (
              <span className="read-count">{message.readBy?.length || 0}人が既読</span>
            )}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="chat-input-area">
        <div className="input-wrapper">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="メッセージを入力"
          />
          <button className="send-button" onClick={handleSendMessage}>送信</button>
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;