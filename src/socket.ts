import io from "socket.io-client";

export const socket = io(window.location.host, {
  autoConnect: false,
});
