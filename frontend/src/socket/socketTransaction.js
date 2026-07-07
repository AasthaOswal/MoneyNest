// src/socket/socketTransaction.js

import { getSocket } from "./socket";

const EVENTS = [
  "transaction:new",
  "transaction:update",
  "transaction:delete",
];

export const setupTransactionListeners = (callback) => {
  const socket = getSocket();

  // console.log("Socket:", socket);
  // console.log("Connected:", socket?.connected);

  if(!socket){
    console.log("No Socket object");
    return;
  }

  EVENTS.forEach(event => {
    console.log("Registering", event);
    socket.on(event, callback);
  });

  console.log(socket.listeners("transaction:new"));
};

export const removeTransactionListeners = (callback) => {
  const socket = getSocket();

  if (!socket) return;

  EVENTS.forEach((event) => {
    socket.off(event, callback);
  });
};