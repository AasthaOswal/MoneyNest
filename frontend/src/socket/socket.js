import { io } from "socket.io-client";

let socket = null;

export const initSocket = () => {
  if (socket) return socket;


  
  // const SOCKET_URL =
  // import.meta.env.VITE_ENV === "production"
  //   ? "/"
  //   : "http://localhost:5000";


  const SOCKET_URL =
  import.meta.env.VITE_ENV === "production"
    ? import.meta.env.VITE_API_URL
    : "http://localhost:5000";

    const token = localStorage.getItem("accessToken");

  socket = io(
    SOCKET_URL,
    
    {
      auth: {
        token
      },
      // withCredentials: true,

      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    }
  );



  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.log("Socket connection error:", err);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};