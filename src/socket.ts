import io from "socket.io-client";

const SERVER_URL = "https://tick-tack-toe-lyart.vercel.app:3000";
export const socket = io(SERVER_URL, {
  autoConnect: false,
});
