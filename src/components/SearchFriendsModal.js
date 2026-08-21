import React, { useState } from 'react';
import './SearchFriendsModal.css';

function SearchFriendsModal({
  onClose,
  currentUser,
  users,
  onAddFriend,
  isAdmin,
  onBanUser,
  onRestrictUser,
  chats,
  setChats
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUserForAdmin, setSelectedUserForAdmin] = useState(null);
  const [restrictHours, setRestrictHours] = useState(1);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const results = users.filter(
      u => u.phoneNumber.includes(searchQuery) && u.id !== currentUser.id
    );
    setSearchResults(results);
  };

  const handleAddFriend = (user) => {
    onAddFriend(user.username);
  };

  const handleAdminViewProfile = (user) => {
    setSelectedUserForAdmin(user);
  };

  const handleBanUser = (username) => {
    if (window.confirm(`${username} をBANしますか？`))
      onBanUser(username);
  };

  const handleRestrictUser = (username) => {
    if (window.confirm(`${username} を ${restrictHours} 時間閲覧のみにしますか？`))
      onRestrictUser(username, restrictHours);
  };

  const handleAdminChat = (user) => {
    const existingChat = chats.find(
      c => c.participants.includes(currentUser.username) && c.participants.includes(user.username)
    );
    if (!existingChat) {
      const newChat = {
        id: Math.random(),
        participants: [currentUser.username, user.username],
        isGroupChat: false,
        messages: [],
        lastMessage: new Date()
      };
      setChats([...chats, newChat]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>友達を追加</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="電話番号で検索"
          />
          <button onClick={handleSearch}>検索</button>
        </div>

        <div className="search-results">
          {searchResults.map(user => (
            <div key={user.id} className="result-item">
              <div className="user-info">
                <div className="user-avatar">{user.profile?.avatar || '👤'}</div>
                <div className="user-details">
                  <p className="username">{user.username}</p>
                  <p className="phone">{user.phoneNumber}</p>
                </div>
              </div>
              <div className="user-actions">
                {isAdmin ? (
                  <>
                    <button className="add-button" onClick={() => handleAdminChat(user)}>
                      チャット
                    </button>
                    <button className="admin-button" onClick={() => handleAdminViewProfile(user)}>
                      管理
                    </button>
                  </>
                ) : (
                  <button className="add-button" onClick={() => handleAddFriend(user)}>
                    友達に追加
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedUserForAdmin && isAdmin && (
          <div className="admin-panel">
            <div className="admin-header">
              <h3>{selectedUserForAdmin.username}</h3>
              <button className="close-button" onClick={() => setSelectedUserForAdmin(null)}>×</button>
            </div>
            <div className="admin-actions">
              <button className="ban-button" onClick={() => handleBanUser(selectedUserForAdmin.username)}>
                BAN
              </button>
              <div className="restrict-section">
                <label>
                  閲覧制限（時間）:
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={restrictHours}
                    onChange={(e) => setRestrictHours(parseInt(e.target.value))}
                  />
                </label>
                <button className="restrict-button" onClick={() => handleRestrictUser(selectedUserForAdmin.username)}>
                  適用
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchFriendsModal;