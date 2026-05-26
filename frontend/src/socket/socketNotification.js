// notificationSocket.js

import { getSocket } from "./socket";

export const setupNotificationListener = (callback) => {
  const socket = getSocket();

  if (!socket) return;

  socket.on("notification", callback);
};

export const removeNotificationListener = () => {
  const socket = getSocket();

  if (!socket) return;

  socket.off("notification");
};