import io from "socket.io-client";

//в проде заменить на https://tick-tack-toe.onrender.com/
const SERVER_URL = "http://localhost:3000";
export const socket = io(SERVER_URL, { autoConnect: false });
