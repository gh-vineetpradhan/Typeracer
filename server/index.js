const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const cors = require("cors");
const paragraphs = require("./public/paragraphs.json");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL },
});

app.use(cors({ origin: process.env.FRONTEND_URL }));

const PORT = 5000;

let currGlobalRoom = null;
const players = new Map();

const joinRoom = (socket, room) => {
  socket.join(room);
  socket.emit("added-to-game", {
    players: Array.from(io.sockets.adapter.rooms.get(room)).map((pl) => [
      pl,
      players.get(pl),
    ]),
    paragraph: paragraphs[room % 200],
  });
  socket.to(room).emit("player-joined", [socket.id, players.get(socket.id)]);
};

io.on("connection", (socket) => {
  socket.on("generate-paragraph", () => {
    socket.emit(
      "paragraph-generated",
      paragraphs[Math.floor(Math.random() * 200)]
    );
  });
  socket.on("add-to-global", (username) => {
    players.set(socket.id, username);
    if (
      io.sockets.adapter.rooms.get(currGlobalRoom)?.size < 4 &&
      60000 - (new Date().getTime() - currGlobalRoom) > 10000
    ) {
      joinRoom(socket, currGlobalRoom);
    } else {
      currGlobalRoom = new Date().getTime();
      joinRoom(socket, currGlobalRoom);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Listening to Port: ${PORT}`);
});
