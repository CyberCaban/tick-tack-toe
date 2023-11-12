import io from "socket.io-client";

const SERVER_URL = window.location.href + ":4000";
export const socket = io(SERVER_URL, {
  autoConnect: false,
});
