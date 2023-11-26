import io from "socket.io-client";

//в проде заменить на https://tick-tack-toe.onrender.com/
// process.env.RENDER_EXTERNAL_HOSTNAME
const SERVER_URL = "https://tick-tack-toe.onrender.com/";
export const socket = io(SERVER_URL, { autoConnect: false });
