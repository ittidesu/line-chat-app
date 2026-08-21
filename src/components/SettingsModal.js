import React, { useState } from 'react';
import './SettingsModal.css';

function SettingsModal({ onClose, onThemeChange }) {
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  const colors = [
    { name: '白', value: '#ffffff' },
    { name: 'ライトグレー', value: '#f0f0f0' },
    { name: '薄紫', value: '#e8d5f2' },
    { name: '薄青', value: '#d0e8f2' },
    { name: 'クリーム色', value: '#fffacd' },
    { name: '薄緑', value: '#e8f5e9' },
    { name: 'ライトピンク', value: '#ffe0f0' },
    { name: 'ライトオレンジ', value: '#ffe8d6' }
  ];

  const handleColorChange = (color) => {
    setSelectedColor(color);
    onThemeChange(color);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>テーマ設定</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="color-grid">
          {colors.map(color => (
            <div
              key={color.value}
              className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorChange(color.value)}
              title={color.name}
            >
              {selectedColor === color.value && <span className="check-mark">✓</span>}
            </div>
          ))}
        </div>
        <p className="color-label">色を選んでホーム画面の背景を変更できます</p>
      </div>
    </div>
  );
}

export default SettingsModal;