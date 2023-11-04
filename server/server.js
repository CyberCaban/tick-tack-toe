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
/*
 * @desc массив для хранения информации с комнат
 * Внутри находятся объекты типа {room: string, sideX, sideO, currTurn, field:
 * {'cell-00':null,'cell-01':null,'cell-02':null,
 * 'cell-10':null, 'cell-11':null, 'cell-12':null,
 * 'cell-20':null, 'cell-21':null, 'cell-22':null}}
 */
let rooms = [
  {
    room: "sss",
    sideX: "dsa",
    sideO: "sad",
    currTurn: "dsa",
    field: {
      "cell-00": null,
      "cell-01": null,
      "cell-02": null,
      "cell-10": null,
      "cell-11": null,
      "cell-12": null,
      "cell-20": null,
      "cell-21": null,
      "cell-22": null,
    },
  },
];

const start = () => {
  try {
    io.on("connection", (socket) => {
      console.log("user:", socket.id, "connected");

      socket.on("joinRoom", (data) => {
        const { username, room } = data;

        const usersInRoom = allUsers.filter((user) => user.room === room);

        if (usersInRoom.length < 2) {
          //add a button to pick x or o

          socket.join(room);
          allUsers.push({ id: socket.id, username, room });

          const timestamp = Date.now();

          //сообщение всем участникам комнаты, что юзер присоединился
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
        } else {
          socket.emit("Error", { message: "can't join the room" });
        }

        if (allUsers.filter((user) => user.room === room).length === 2) {
          const usersInRoom = allUsers.filter((user) => user.room === room);
          console.log(usersInRoom);
          const user1 = usersInRoom[0];
          const user2 = usersInRoom[1];
          io.to([user1.id, user2.id]).emit("showPickASideComponent");
        }

        socket.on("pickASide", (data) => {
          const user1 = allUsers.filter(
            (user) => user.room === room && user.id === socket.id
          )[0];
          const user2 = allUsers.filter(
            (user) => user.room === room && user.id !== socket.id
          )[0];
          user1.side = data.side;

          switch (data.side) {
            case "X":
              user2.side = "O";
              break;
            case "O":
              user2.side = "X";
              break;
          }

          io.to([user1.room, user2.room]).emit("showPickASideComponent");
          io.to(user1.id).emit("sidePick", { side: user1.side });
          io.to(user2.id).emit("sidePick", { side: user2.side });

          if (rooms.filter((item) => item.room === user1.room)) {
            const sideX = user1.side === "X" ? user1.id : user2.id;
            const sideO = user1.side === "O" ? user1.id : user2.id;

            rooms.push({
              room: user1.room,
              sideX,
              sideO,
              currTurn: sideX,
              field: {
                "cell-00": null,
                "cell-01": null,
                "cell-02": null,
                "cell-10": null,
                "cell-11": null,
                "cell-12": null,
                "cell-20": null,
                "cell-21": null,
                "cell-22": null,
              },
            });
          }

          const turnPass = rooms.find(
            (room) => room.room === user1.room
          ).currTurn;
          io.to(turnPass).emit("yourTurn");

          socket.emit("devInfo", allUsers);
        });

        socket.on("turn", (data) => {
          const { row, cell } = data;
          const clickedCellId = "cell-" + row + cell;
          const room = rooms.find((room) => room.currTurn === socket.id);
          console.log(room);
          const side = room.sideX === socket.id ? "X" : "O";

          const nextTurn =
            room.currTurn === room.sideX ? room.sideO : room.sideX;

          if (room) {
            room.field[clickedCellId] = side;
            room.currTurn = nextTurn;

            const turnPass = rooms.find(
              (room) => room.sideX === socket.id || room.sideO === socket.id
            ).currTurn;
            io.to(turnPass).emit("yourTurn");

            io.to([room.sideX, room.sideO]).emit("fieldUpdate", room.field);
          } else {
            console.log("opponent turn");
          }
        });

        socket.on("sendMessage", (data) => {
          const { username, room, message, timestamp } = data;

          io.in(room).emit("messageReceive", {
            message,
            username,
            timestamp,
          });
          socket.emit("devInfo", allUsers);
        });

        //devInfo
        socket.on("devInfo", () => {
          socket.emit("devInfo", allUsers);
          console.log(allUsers);
        });
      });

      socket.on("disconnect", () => {
        console.log("user:", socket.id, "disconnected");
        allUsers = allUsers.filter((user) => socket.id !== user.id);
        rooms = rooms.filter(
          (item) => item.sideX !== socket.id && item.sideO !== socket.id
        );
        console.log(rooms);
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
