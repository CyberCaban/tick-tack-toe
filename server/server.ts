import { Request, Response } from "express";
import { Socket } from "socket.io";

require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 3000;
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.VERCEL_URL + ":" + PORT,
    methods: ["GET", "POST"],
  },
});
io.listen(4000);

app.use(express.static(path.resolve("./dist")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

type ESide = "X" | "O" | null;

interface IUser {
  id: string;
  username: string;
  room: string;
  side?: ESide;
}

interface IRoom {
  room: string;
  sideX: string;
  sideO: string;
  currTurn: string;
  field: {
    "cell-00": null | ESide;
    "cell-01": null | ESide;
    "cell-02": null | ESide;
    "cell-10": null | ESide;
    "cell-11": null | ESide;
    "cell-12": null | ESide;
    "cell-20": null | ESide;
    "cell-21": null | ESide;
    "cell-22": null | ESide;
  };
}

function socketConnect(socket: Socket) {
  socket.on("joinRoom", (data) => {
    JoinRoom(socket, data);
  });

  socket.on("disconnect", () => {
    socketDisconnect(socket);
  });
}

function JoinRoom(socket: Socket, data: { username: string; room: string }) {
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
    // console.log(usersInRoom);
    const user1 = usersInRoom[0];
    const user2 = usersInRoom[1];
    io.to([user1.id, user2.id]).emit("showPickASideComponent");
  }

  socket.on("pickASide", (data) => {
    PickASide(socket, data, room);
  });

  socket.on("turn", (data) => {
    Turn(socket, data);
  });

  socket.on("sendMessage", (data) => {
    SendMessage(socket, data);
  });

  //devInfo
  socket.on("devInfo", () => {
    socket.emit("devInfo", allUsers);
    // console.log(allUsers);
  });
}

function PickASide(socket: Socket, data: { side: ESide }, room: string) {
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

  // @ts-ignore
  const turnPass = rooms.find((room) => room.room === user1.room).currTurn;
  io.to(turnPass).emit("yourTurn");
}

function Turn(
  socket: Socket,
  data: { row: "0" | "1" | "2"; cell: "0" | "1" | "2" }
) {
  const { row, cell } = data;
  //находим ид нажатой клетки
  const clickedCellId = "cell-" + row + cell;
  //находим комнату
  const room = rooms.find((room) => room.currTurn === socket.id);

  if (room) {
    //определяем текущего ходящего
    const currTurn = room.currTurn === room.sideX ? room.sideX : room.sideO;

    //определяем следующего ходящего
    const nextTurn = room.currTurn === room.sideX ? room.sideO : room.sideX;

    //определяем сторону ходящего
    const side = room.sideX === socket.id ? "X" : "O";

    //записываем ход на сервере
    // @ts-ignore
    if (room.field[clickedCellId] === null) {
      // @ts-ignore
      room.field[clickedCellId] = side;
      io.to([room.sideX, room.sideO]).emit("fieldUpdate", room.field);

      const winner = winningConditions(room.field);
      if (winner) {
        const W = winner === "X" ? room.sideX : room.sideO;
        const L = winner === "X" ? room.sideO : room.sideX;
        io.to(W).emit("YouWon");
        io.to(L).emit("YouLose");
      } else {
        room.currTurn = nextTurn;

        io.to(currTurn).emit("yourTurn", { turn: "Opponent turn" });
        io.to(nextTurn).emit("yourTurn", { turn: "Your turn" });
      }
    }
  } else {
    console.log("opponent turn");
  }
}

function winningConditions(data: IRoom["field"]) {
  const winCombs = [
    ["cell-00", "cell-01", "cell-02"],
    ["cell-10", "cell-11", "cell-12"],
    ["cell-20", "cell-21", "cell-22"],
    ["cell-00", "cell-10", "cell-20"],
    ["cell-01", "cell-11", "cell-21"],
    ["cell-02", "cell-12", "cell-22"],
    ["cell-00", "cell-11", "cell-22"],
    ["cell-02", "cell-11", "cell-20"],
  ];
  const field = data;

  for (const comb of winCombs) {
    const [a, b, c] = comb;
    // @ts-ignore
    if (field[a] && field[a] === field[b] && field[a] === field[c]) {
      // @ts-ignore
      return field[a];
    }
  }
  return null;
}

function SendMessage(
  socket: Socket,
  data: { username: string; room: string; message: string; timestamp: string }
) {
  const { username, room, message, timestamp } = data;

  io.in(room).emit("messageReceive", {
    message,
    username,
    timestamp,
  });
}

function socketDisconnect(socket: Socket) {
  console.log("user:", socket.id, "disconnected");
  allUsers = allUsers.filter((user) => socket.id !== user.id);
  rooms = rooms.filter(
    (item) => item.sideX !== socket.id && item.sideO !== socket.id
  );
}

/**
 * @desc массив, который хранит всех пользователей.
 */
let allUsers: IUser[] = [];
/**
 * @desc массив для хранения информации с комнат
 */
let rooms: IRoom[] = [];

const start = () => {
  try {
    io.on("connection", (socket: Socket) => {
      socketConnect(socket);
    });

    app.get("*", function (req: Request, res: Response) {
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
