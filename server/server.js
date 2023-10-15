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
 * Внутри находятся объекты типа {id: socket.id, username, room, side: "X" || "O"}
 */
let allUsers = [];

const start = () => {
    try {
        io.on("connection", (socket) => {
            console.log("user:", socket.id, "connected");

            socket.on("joinRoom", (data) => {
                const { username, room } = data;

                if (allUsers.filter((user) => user.room == room).length < 2) {
                    //add a button to pick x or o

                    socket.join(room);
                    allUsers.push({ id: socket.id, username, room });

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

                    socket.on("pickASide", (data) => {
                        const user = allUsers.find(
                            (item) => item.id == socket.id
                        );
                        user.side = data.side;
                        console.log(user);
                    });

                    socket.on("sendMessage", (data) => {
                        const { username, room, message, timestamp } = data;

                        io.in(room).emit("messageReceive", {
                            message,
                            username,
                            timestamp,
                        });
                    });
                } else {
                    socket.emit("Error", { message: "can't join the room" });

                    socket.on("sendMessage", (data) => {
                        const { username, room, message, timestamp } = data;

                        io.in(room).emit("messageReceive", {
                            message,
                            username,
                            timestamp,
                        });
                    });
                }

                //devInfo
                socket.on("devInfo", () => {
                    socket.emit("devInfo", {
                        allUsers,
                    });
                    console.log(allUsers);
                });
            });

            socket.on("disconnect", () => {
                console.log("user:", socket.id, "disconnected");
                allUsers = allUsers.filter((user) => socket.id !== user.id);
                console.log(allUsers);
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
