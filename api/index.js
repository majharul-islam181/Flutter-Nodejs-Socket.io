import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server);
const userSockets = new Map();

io.on("connection", (socket) => {
  console.log(`connected: ${socket.id}`);

  socket.on("user-join", (data) => {
    userSockets.set(data, socket.id);
    io.to(socket.id).emit("session-join", "Your session has been started");
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of userSockets.entries()) {
      if (socketId == socket.id) {
        userSockets.delete(userId);
        break;
      }
    }
  });
});

app.use(express.json());

app.get("/api/logout", (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "UserId is required ",
    });
  }

  const socketId = userSockets.get(userId);
  if (socketId) {
    io.to(socketId).emit("session-expired", "Your session has been terminated");
    return res
      .status(200)
      .json({ success: true, message: "Logged out successful!" });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "No active session found" });
  }
});

server.listen(3000,()=>{
    console.log('Server started on port 3000');
})
