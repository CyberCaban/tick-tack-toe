require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
io.listen(4000);

const play = require("./routes/router");
// const auth = require("./routes/authRouter");

app.use(express.static(path.resolve("./dist")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/play", play);

/**
 * @desc массив, который хранит всех пользователей.
 * Внутри находятся объекты типа {id: socket.id, username, room}
 */
let allUsers = [];

const start = () => {
    try {
        io.on("connection", (socket) => {
            console.log("user:", socket.id, "connected");

            socket.on("joinRoom", (data) => {
                const { username, room } = data;
                socket.join(room);
                console.log(data);

                allUsers.push({ id: socket.id, username, room });

                //devInfo
                socket.emit("devInfo", {
                    allUsers,
                });
                console.log(allUsers);

                const timestamp = Date.now();

                //сообщение всем участникам комнаты, что юзер присоеденился
                socket.to(room).emit("messageReceive", {
                    message: `${username} has joined`,
                    username: "server",
                    timestamp,
                });

                //приветствие
                socket.emit("messageReceive", {
                    message: `Welcome ${username}`,
                    username: "server",
                    timestamp,
                });
            });

            socket.on("disconnect", () => {
                console.log("user:", socket.id, "disconnected");
            });
        });

        app.get("*", (req, res) => {
            res.sendFile(path.resolve(__dirname, "../dist/index.html"));
        });
        app.listen(PORT, () => {
            console.log(`started server at ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
};

start();
