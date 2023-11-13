import io from "socket.io-client";

const SERVER_URL = "localhost" + ":4000";
export const socket = io(SERVER_URL);
