import React, { useState } from 'react';
import './LoginScreen.css';

function LoginScreen({ onLogin, onSignupClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      alert('ユーザー名とパスワードを入力してください');
      return;
    }
    if (password.length < 4 || password.length > 12) {
      alert('パスワードは4文字以上12文字以下です');
      return;
    }
    onLogin(username, password);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>LINE</h1>
        <div className="login-form">
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
          <button className="login-button" onClick={handleLogin}>
            ログイン
          </button>
        </div>
        <button className="signup-link" onClick={onSignupClick}>
          新規登録はこちら
        </button>
      </div>
    </div>
  );
}

export default LoginScreen;