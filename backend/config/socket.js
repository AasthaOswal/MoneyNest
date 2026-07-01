import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";


let ioInstance = null;

export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized");
  }

  return ioInstance;
};



export function initializeSocket(httpServer, app) {
  const io = new Server(httpServer, {
    // path: "/ws",
    cors: {
      origin: [
        "http://localhost:5173",
        "https://project-money-nest.vercel.app",
        "https://money-nest-one.vercel.app",
        process.env.CLIENT_URL,
      ].filter(Boolean),
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  ioInstance = io;

  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(
          socket.handshake.headers.cookie || ""
      );

      const token = cookies.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;

      return next();
    } catch (err) {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    const { userId, familyId } = socket.user;

    socket.join(`user:${userId}`);
    if (familyId) socket.join(`family:${familyId}`);
  });

  app.set("io", io);
  return io;
}
