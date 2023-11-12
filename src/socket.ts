import io from "socket.io-client";

const SERVER_URL =
  process.env.NEXT_PUBLIC_VERCEL_URL || "https://localhost:4000";
export const socket = io(SERVER_URL, {
  autoConnect: false,
});
