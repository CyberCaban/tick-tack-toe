require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;
// const io = require("socket.io")(
//     require("http").createServer(require("express")())
// );
// const server = require("http").createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const play = require("./routes/router");
// const auth = require("./routes/authRouter");

app.use(express.static(path.resolve("./dist")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/play", play);

const start = () => {
    try {
        app.get("*", (req, res) => {
            res.sendFile(path.resolve(__dirname, "../dist/index.html"));
        });
        app.listen(PORT, () => {
            console.log(`started server at ${PORT}`);
        });

        console.log(1231);
    } catch (e) {
        console.log(e);
    }
};

io.on("connection", (socket) => {
    console.log("user connected");
    console.log(socket.id);
});

start();
