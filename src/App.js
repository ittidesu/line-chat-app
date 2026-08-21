import React, { useState, useEffect } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import ProfileSetupScreen from './components/ProfileSetupScreen';
import HomeScreen from './components/HomeScreen';
import ChatScreen from './components/ChatScreen';
import AdminNotificationScreen from './components/AdminNotificationScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [themeColor, setThemeColor] = useState('#ffffff');
  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [chats, setChats] = useState([]);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [restrictedUsers, setRestrictedUsers] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);

  // Initialize users from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize with admin user
      const adminUser = {
        id: 1,
        username: 'curo',
        password: '071011',
        phoneNumber: generatePhoneNumber(),
        isAdmin: true,
        profileComplete: true,
        banned: false,
        profile: {
          bio: 'Admin User',
          avatar: '👤'
        }
      };
      setUsers([adminUser]);
      localStorage.setItem('users', JSON.stringify([adminUser]));
    }
  }, []);

  function generatePhoneNumber() {
    return 'PH' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  const handleLogin = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      if (user.banned) {
        alert('このアカウントはBANされています');
        return;
      }
      setCurrentUser(user);
      if (user.profileComplete) {
        setCurrentScreen('home');
      } else {
        setCurrentScreen('profileSetup');
      }
    } else {
      alert('ユーザー名またはパスワードが間違っています');
    }
  };

  const handleSignup = (username, password, confirmPassword) => {
    if (password !== confirmPassword) {
      alert('パスワードが一致しません');
      return;
    }
    if (password.length < 4 || password.length > 12) {
      alert('パスワードは4文字以上12文字以下です');
      return;
    }
    if (users.find(u => u.username === username)) {
      alert('このユーザー名は既に存在します');
      return;
    }
    const newUser = {
      id: users.length + 1,
      username,
      password,
      phoneNumber: generatePhoneNumber(),
      isAdmin: false,
      profileComplete: false,
      banned: false,
      friends: [],
      blockedUsers: [],
      restrictedUsers: [],
      profile: {
        bio: '',
        avatar: '👤'
      }
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setCurrentUser(newUser);
    setCurrentScreen('profileSetup');
  };

  const handleProfileSetup = (profile) => {
    const updatedUser = { ...currentUser, profileComplete: true, profile };
    setCurrentUser(updatedUser);
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
    setSelectedChat(null);
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setCurrentScreen('chat');
  };

  const handleSendMessage = (message, isGroupChat = false) => {
    if (!selectedChat) return;

    const newMessage = {
      id: Math.random(),
      sender: currentUser.username,
      content: message,
      timestamp: new Date(),
      read: false,
      readBy: []
    };

    if (isGroupChat) {
      const updatedChats = chats.map(chat => {
        if (chat.id === selectedChat.id) {
          return { ...chat, messages: [...(chat.messages || []), newMessage] };
        }
        return chat;
      });
      setChats(updatedChats);
    } else {
      const updatedChats = chats.map(chat => {
        if (chat.id === selectedChat.id) {
          return { ...chat, messages: [...(chat.messages || []), newMessage] };
        }
        return chat;
      });
      setChats(updatedChats);
    }
  };

  const handleMarkAsRead = (chatId, messageId) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: chat.messages.map(msg => {
            if (msg.id === messageId && msg.sender !== currentUser.username) {
              return { ...msg, read: true, readAt: new Date() };
            }
            return msg;
          })
        };
      }
      return chat;
    });
    setChats(updatedChats);
  };

  const handleAddFriend = (friendUsername) => {
    if (friendUsername === currentUser.username) {
      alert('自分自身を友達に追加することはできません');
      return;
    }
    const targetUser = users.find(u => u.username === friendUsername);
    if (!targetUser) {
      alert('ユーザーが見つかりません');
      return;
    }
    setPendingRequests([...pendingRequests, { from: currentUser.username, to: friendUsername }]);
    alert('友達申請を送信しました');
  };

  const handleAcceptFriendRequest = (fromUsername) => {
    setFriends([...friends, fromUsername]);
    setPendingRequests(pendingRequests.filter(r => r.from !== fromUsername));
  };

  const handleRejectFriendRequest = (fromUsername) => {
    setPendingRequests(pendingRequests.filter(r => r.from !== fromUsername));
  };

  const handleAddNotification = (title, content) => {
    if (content.length > 200) {
      alert('お知らせは200文字以下で入力してください');
      return;
    }
    const newNotification = {
      id: Math.random(),
      title,
      content,
      timestamp: new Date(),
      admin: currentUser.username
    };
    setAdminNotifications([...adminNotifications, newNotification]);
    setNotifications([...notifications, newNotification]);
  };

  const handleBlockUser = (username) => {
    const updatedUser = { ...currentUser, blockedUsers: [...(currentUser.blockedUsers || []), username] };
    setCurrentUser(updatedUser);
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleDeleteFriend = (username) => {
    const updatedUser = { ...currentUser, friends: (currentUser.friends || []).filter(f => f !== username) };
    setCurrentUser(updatedUser);
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleBanUser = (username) => {
    const updatedUsers = users.map(u => u.username === username ? { ...u, banned: true } : u);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleRestrictUser = (username, hours) => {
    const restrictedUser = users.find(u => u.username === username);
    const updatedUsers = users.map(u => u.username === username ? { ...u, restrictedUntil: new Date(Date.now() + hours * 3600000) } : u);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const containerStyle = {
    backgroundColor: themeColor,
    minHeight: '100vh'
  };

  return (
    <div style={containerStyle}>
      {currentScreen === 'login' && <LoginScreen onLogin={handleLogin} onSignupClick={() => setCurrentScreen('signup')} />}
      {currentScreen === 'signup' && <SignupScreen onSignup={handleSignup} onBackClick={() => setCurrentScreen('login')} />}
      {currentScreen === 'profileSetup' && <ProfileSetupScreen currentUser={currentUser} onComplete={handleProfileSetup} />}
      {currentScreen === 'home' && (
        <HomeScreen
          currentUser={currentUser}
          onLogout={handleLogout}
          onSelectChat={handleSelectChat}
          onThemeChange={setThemeColor}
          onAddNotification={handleAddNotification}
          onBanUser={handleBanUser}
          onRestrictUser={handleRestrictUser}
          friends={friends}
          pendingRequests={pendingRequests}
          onAddFriend={handleAddFriend}
          onAcceptFriendRequest={handleAcceptFriendRequest}
          onRejectFriendRequest={handleRejectFriendRequest}
          notifications={adminNotifications}
          users={users}
          chats={chats}
          setChats={setChats}
        />
      )}
      {currentScreen === 'chat' && selectedChat && (
        <ChatScreen
          chat={selectedChat}
          currentUser={currentUser}
          onBack={() => setCurrentScreen('home')}
          onSendMessage={handleSendMessage}
          onMarkAsRead={handleMarkAsRead}
          onBlockUser={handleBlockUser}
          onDeleteFriend={handleDeleteFriend}
        />
      )}
    </div>
  );
}

export default App;