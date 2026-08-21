import React, { useState } from 'react';
import './ProfileSetupScreen.css';

function ProfileSetupScreen({ currentUser, onComplete }) {
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('👤');
  const [selectedAvatarEmoji, setSelectedAvatarEmoji] = useState('👤');

  const avatarOptions = ['👤', '😀', '😂', '😍', '🤔', '😎', '🤖', '👨', '👩', '👧', '👦'];

  const handleComplete = () => {
    onComplete({
      bio,
      avatar: selectedAvatarEmoji
    });
  };

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-box">
        <h1>プロフィール設定</h1>
        <div className="profile-setup-form">
          <div className="form-group">
            <label>アバター選択</label>
            <div className="avatar-selector">
              {avatarOptions.map((emoji) => (
                <button
                  key={emoji}
                  className={`avatar-option ${selectedAvatarEmoji === emoji ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatarEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="avatar-preview">
              <p>選択中: <span className="avatar-large">{selectedAvatarEmoji}</span></p>
            </div>
          </div>
          <div className="form-group">
            <label>自己紹介</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="自己紹介を入力してください（任意）"
              maxLength="100"
            />
            <span className="char-count">{bio.length}/100</span>
          </div>
          <div className="info-section">
            <p>ユーザー名: <strong>{currentUser?.username}</strong></p>
            <p>電話番号: <strong>{currentUser?.phoneNumber}</strong></p>
          </div>
          <button className="complete-button" onClick={handleComplete}>
            完了
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetupScreen;