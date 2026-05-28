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
    cors: {
      origin: [
        "http://localhost:5173",
        "https://project-money-nest.vercel.app",
        "https://money-nest-one.vercel.app",
        process.env.CLIENT_URL,
      ].filter(Boolean),

      credentials: true,
    },
  });

  // save globally
  ioInstance = io;

  // socket auth middleware
  io.use((socket, next) => {
    try {
      console.log("socket.handshake.headers: ", socket.handshake.headers, "\n\n\n");
      const cookies = cookie.parse(
        socket.handshake.headers.cookie || ""
      );

      console.log("cookies: ",cookies, "\n\n\n")

      const token = cookies.accessToken;

      console.log("token:" ,token, "\n\n\n")
      console.log("coookies : ",cookies, "\n\n\n")

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.user = decoded;

      console.log(socket.user)

      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    const userId = socket.user.userId;
    const familyId = socket.user.familyId

    socket.join(`user:${userId}`);
    socket.join(`family:${familyId}`);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  app.set("io", io);

  return io;
}