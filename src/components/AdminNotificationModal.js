import React, { useState } from 'react';
import './AdminNotificationModal.css';

function AdminNotificationModal({
  onClose,
  currentUser,
  notifications,
  isAdmin,
  onAddNotification
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handlePostNotification = () => {
    if (!title.trim() || !content.trim()) {
      alert('タイトルと内容を入力してください');
      return;
    }

    if (content.length > 200) {
      alert('内容は200文字以下にしてください');
      return;
    }

    onAddNotification(title, content);
    setTitle('');
    setContent('');
    alert('お知らせを投稿しました');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>お知らせ</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {isAdmin && (
          <div className="admin-notification-form">
            <h3>お知らせを投稿</h3>

            <div className="form-group">
              <label>タイトル</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="タイトルを入力"
              />
            </div>

            <div className="form-group">
              <label>内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="お知らせの内容を入力"
                maxLength="200"
              />
              <span className="char-count">
                {content.length}/200
              </span>
            </div>

            <button
              className="post-button"
              onClick={handlePostNotification}
            >
              投稿
            </button>
          </div>
        )}

        <div className="notifications-list">
          <h3>配信中のお知らせ</h3>

          {notifications.length === 0 ? (
            <p className="empty-message">
              お知らせはありません
            </p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="notification-card">
                <h4>{notif.title}</h4>
                <p>{notif.content}</p>

                <span className="notif-admin">
                  投稿者: {notif.admin}
                </span>

                <span className="notif-time">
                  {new Date(notif.timestamp).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminNotificationModal;
