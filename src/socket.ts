import io from "socket.io-client";

const SERVER_URL = "https://tick-tack-toe-cybercaban.vercel.app";
export const socket = io(SERVER_URL, {
  autoConnect: true,
});
