import io from "socket.io-client";

const SERVER_URL = "https://tick-tack-toe.onrender.com/";
export const socket = io(SERVER_URL, { autoConnect: false });
