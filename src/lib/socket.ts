import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true); 
      }

      const allowedOrigins = [
        "http://localhost:5173",
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST","PATCH","DELETE","PUT"],
    allowedHeaders: ["Content-Type"],
  },
});

const userSocketMap: { [userId: string]: string } = {};

export function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap[userId];
}

io.on("connection", (socket: Socket) => {
  // console.log("A modified user connected", socket.id);

  const userId = socket.handshake.query.userId as string;

  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A modified user", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
