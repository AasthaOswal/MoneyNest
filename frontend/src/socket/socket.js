import { io } from "socket.io-client";


let socket = null;



export const initSocket = () => {
  if (socket) return socket;

  let token = localStorage.getItem("socketToken");

  console.log("socket token from initiSocket:", token);

  if (!token) {
      console.error("No socket token in localstorage")
  }

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL; // backend origin only

  socket = io(SOCKET_URL, {
        auth: {
        token,
    },

    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    forceNew: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });


  socket.on("connect_error", async (err) => {

    console.log("Socket connection error:", err);

    if (err.message !== "Authentication error") {
        return;
    }

    try {

        const token = await getSocketToken();

        socket.auth = {
            token,
        };

        socket.connect();

    } catch (e) {

        console.log("Unable to reconnect");

    }

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


