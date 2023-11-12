import io from "socket.io-client";

const SERVER_URL = process.env.VERCEL_URL + ":4000";
export const socket = io(SERVER_URL, {
  autoConnect: false,
});
