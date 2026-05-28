// src/socket/socketTransaction.js

import { getSocket } from "./socket";

const EVENTS = [
  "transaction:new",
  "transaction:update",
  "transaction:delete",
];

export const setupTransactionListeners = (callback) => {
  const socket = getSocket();

  if (!socket) return;

  EVENTS.forEach((event) => {
    socket.on(event, callback);
  });
};

export const removeTransactionListeners = (callback) => {
  const socket = getSocket();

  if (!socket) return;

  EVENTS.forEach((event) => {
    socket.off(event, callback);
  });
};