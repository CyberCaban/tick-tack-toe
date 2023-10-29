const server = require("http").createServer(require("express")());
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

module.exports = io;
