import React, { useState } from 'react';
import './SignupScreen.css';

function SignupScreen({ onSignup, onBackClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = () => {
    if (!username || !password || !confirmPassword) {
      alert('すべてのフィールドを入力してください');
      return;
    }
    if (password.length < 4 || password.length > 12) {
      alert('パスワードは4文字以上12文字以下です');
      return;
    }
    onSignup(username, password, confirmPassword);
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>新規登録</h1>
        <div className="signup-form">
          <div className="form-group">
            <label>ユーザー名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ユーザー名を入力"
            />
          </div>
          <div className="form-group">
            <label>パスワード</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="4〜12文字"
              />
              <button
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '隠す' : '表示'}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>パスワード確認</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="パスワードを再度入力"
              />
              <button
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '隠す' : '表示'}
              </button>
            </div>
          </div>
          <button className="signup-button" onClick={handleSignup}>
            アカウント作成
          </button>
        </div>
        <button className="back-button" onClick={onBackClick}>
          ログイン画面に戻る
        </button>
      </div>
    </div>
  );
}

export default SignupScreen;