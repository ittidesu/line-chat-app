#!/usr/bin/env node

const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

// ヘルスチェック
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "LINE Chat Server is running"
  });
});

// Reactのbuildを配信
const buildPath = path.join(__dirname, "build");

app.use(express.static(buildPath));

// 接続中ユーザー
const users = new Map();

// 接続
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // ログイン
  socket.on("user:join", (user) => {
    if (!user || !user.id) {
      return;
    }

    users.set(socket.id, {
      socketId: socket.id,
      ...user
    });

    socket.join(`user:${user.id}`);

    console.log(`User joined: ${user.id}`);

    socket.emit("user:joined", {
      success: true,
      user
    });

    // オンライン状態を全員に通知
    io.emit("user:online", {
      userId: user.id
    });
  });

  // チャットルーム参加
  socket.on("chat:join", ({ chatId }) => {
    if (!chatId) return;

    socket.join(`chat:${chatId}`);

    console.log(
      `${socket.id} joined chat:${chatId}`
    );
  });

  // メッセージ送信
  socket.on("message:send", (message) => {
    if (!message) return;

    const chatId = message.chatId;

    if (!chatId) {
      console.log("message:send: chatId is missing");
      return;
    }

    const newMessage = {
      ...message,
      id:
        message.id ||
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,
      createdAt:
        message.createdAt ||
        new Date().toISOString()
    };

    console.log("Message:", newMessage);

    // 同じチャットにいる全員へ送信
    io.to(`chat:${chatId}`).emit(
      "message:received",
      newMessage
    );
  });

  // 切断
  socket.on("disconnect", () => {
    const user = users.get(socket.id);

    if (user) {
      io.emit("user:offline", {
        userId: user.id
      });

      console.log(`User disconnected: ${user.id}`);
    }

    users.delete(socket.id);

    console.log("Client disconnected:", socket.id);
  });
});

// React Router等のSPA用
app.get("*", (req, res) => {
  res.sendFile(
    path.join(buildPath, "index.html")
  );
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `LINE Chat Server running on port ${PORT}`
  );
});
