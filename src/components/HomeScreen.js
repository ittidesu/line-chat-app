import React, { useState, useEffect } from 'react';
import './HomeScreen.css';
import SettingsModal from './SettingsModal';
import SearchFriendsModal from './SearchFriendsModal';
import NotificationsModal from './NotificationsModal';
import AdminNotificationModal from './AdminNotificationModal';

function HomeScreen({
  currentUser,
  onLogout,
  onSelectChat,
  onThemeChange,
  onAddNotification,
  onBanUser,
  onRestrictUser,
  friends,
  pendingRequests,
  onAddFriend,
  onAcceptFriendRequest,
  onRejectFriendRequest,
  notifications,
  users,
  chats,
  setChats
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [showSearchFriends, setShowSearchFriends] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdminNotifications, setShowAdminNotifications] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [displayedChats, setDisplayedChats] = useState([]);
  const [hasNewAdminNotification, setHasNewAdminNotification] = useState(false);

  useEffect(() => {
    // Initialize chats from localStorage or create default
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
    
    // Check for new admin notifications
    if (notifications.length > 0) {
      setHasNewAdminNotification(true);
    }
  }, []);

  useEffect(() => {
    // Save chats to localStorage
    localStorage.setItem('chats', JSON.stringify(chats));
    updateDisplayedChats();
  }, [chats]);

  const updateDisplayedChats = () => {
    const sortedChats = chats.sort((a, b) => {
      const aTime = a.messages?.[a.messages.length - 1]?.timestamp || a.lastMessage || 0;
      const bTime = b.messages?.[b.messages.length - 1]?.timestamp || b.lastMessage || 0;
      return new Date(bTime) - new Date(aTime);
    });
    setDisplayedChats(sortedChats.slice(0, 5));
  };

  const handleCreateChat = (friendUsername) => {
    const existingChat = chats.find(
      c => !c.isGroupChat && (c.participants.includes(friendUsername) && c.participants.includes(currentUser.username))
    );
    if (existingChat) {
      onSelectChat(existingChat);
    } else {
      const newChat = {
        id: Math.random(),
        participants: [currentUser.username, friendUsername],
        isGroupChat: false,
        messages: [],
        lastMessage: new Date()
      };
      setChats([...chats, newChat]);
      onSelectChat(newChat);
    }
  };

  const handleDismissAdminNotification = () => {
    setHasNewAdminNotification(false);
  };

  const logoutUsersNotNotified = () => {
    // This would be triggered when user logs out
    // In a real app, we'd notify other users that this person is offline
  };

  return (
    <div className="home-screen">
      {/* Admin Notification Alert */}
      {hasNewAdminNotification && (
        <div className="admin-notification-alert">
          <div className="alert-content">
            <p>管理者からのお知らせがあるよ！</p>
            <div className="alert-buttons">
              <button onClick={() => {
                setShowAdminNotifications(true);
                handleDismissAdminNotification();
              }}>
                見る？
              </button>
              <button onClick={handleDismissAdminNotification}>
                見ない
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="home-header">
        <div className="header-left">
          <span className="phone-number">📱 {currentUser?.phoneNumber}</span>
        </div>
        <div className="header-center">
          <h1>LINE</h1>
        </div>
        <div className="header-right">
          <button className="header-button" onClick={() => setShowSettings(true)} title="テーマ設定">
            ⚙️
          </button>
          <button className="header-button" onClick={() => setShowSearchFriends(true)} title="友達追加">
            👤
          </button>
          <button className="header-button" onClick={() => setShowFavorites(!showFavorites)} title="お気に入り">
            ⭐
          </button>
          <button className="header-button notification-button" onClick={() => setShowNotifications(true)} title="通知">
            ❗
            {showNotifications === false && showAdminNotifications === false && notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="home-content">
        <div className="chats-section">
          <h2>トーク</h2>
          <div className="chats-list">
            {displayedChats.map(chat => (
              <div
                key={chat.id}
                className="chat-item"
                onClick={() => onSelectChat(chat)}
              >
                <div className="chat-avatar">
                  {chat.isGroupChat ? '👥' : '👤'}
                </div>
                <div className="chat-info">
                  {chat.isGroupChat ? (
                    <div className="chat-title" style={{ color: '#ff69b4' }}>
                      {chat.title}
                    </div>
                  ) : (
                    <div className="chat-title">
                      {chat.participants.find(p => p !== currentUser.username)}
                    </div>
                  )}
                  <div className="chat-preview">
                    {chat.messages && chat.messages.length > 0
                      ? chat.messages[chat.messages.length - 1].content.substring(0, 30)
                      : 'トークを開始'}
                  </div>
                </div>
                <div className="chat-meta">
                  {chat.messages && chat.messages.length > 0 && (
                    <span className="chat-time">
                      {new Date(chat.messages[chat.messages.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {chats.length > 5 && (
            <button className="load-more-button" onClick={() => setDisplayedChats(chats)}>
              もっと見る↓
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="home-footer">
        <button className="logout-button" onClick={onLogout}>
          ログアウト
        </button>
      </div>

      {/* Modals */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onThemeChange={onThemeChange}
        />
      )}
      {showSearchFriends && (
        <SearchFriendsModal
          onClose={() => setShowSearchFriends(false)}
          currentUser={currentUser}
          users={users}
          onAddFriend={handleCreateChat}
          isAdmin={currentUser?.isAdmin}
          onBanUser={onBanUser}
          onRestrictUser={onRestrictUser}
          chats={chats}
          setChats={setChats}
        />
      )}
      {showNotifications && (
        <NotificationsModal
          onClose={() => setShowNotifications(false)}
          pendingRequests={pendingRequests}
          currentUser={currentUser}
          onAcceptFriendRequest={onAcceptFriendRequest}
          onRejectFriendRequest={onRejectFriendRequest}
          unreadMessages={{}}
        />
      )}
      {showAdminNotifications && (
        <AdminNotificationModal
          onClose={() => setShowAdminNotifications(false)}
          currentUser={currentUser}
          notifications={notifications}
          isAdmin={currentUser?.isAdmin}
          onAddNotification={onAddNotification}
        />
      )}
    </div>
  );
}

export default HomeScreen;