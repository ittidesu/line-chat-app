import React from 'react';
import './NotificationsModal.css';

function NotificationsModal({
  onClose,
  pendingRequests,
  currentUser,
  onAcceptFriendRequest,
  onRejectFriendRequest,
  unreadMessages
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>通知</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="notifications-section">
          <h3>友達申請</h3>
          {pendingRequests.filter(r => r.to === currentUser.username).length === 0 ? (
            <p className="empty-message">友達申請はありません</p>
          ) : (
            pendingRequests
              .filter(r => r.to === currentUser.username)
              .map((request, idx) => (
                <div key={idx} className="notification-item">
                  <div className="notification-content">
                    <p>{request.from} があなたを友達に追加したいと言っています</p>
                  </div>
                  <div className="notification-actions">
                    <button
                      className="accept-button"
                      onClick={() => onAcceptFriendRequest(request.from)}
                    >
                      承認
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => onRejectFriendRequest(request.from)}
                    >
                      拒否
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>

        <div className="notifications-section">
          <h3>ログイン中のメッセージ</h3>
          {Object.keys(unreadMessages).length === 0 ? (
            <p className="empty-message">新しいメッセージはありません</p>
          ) : (
            Object.entries(unreadMessages).map(([sender, count]) => (
              <div key={sender} className="notification-item">
                <p>{sender}から{count}件のメッセージがあります</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsModal;