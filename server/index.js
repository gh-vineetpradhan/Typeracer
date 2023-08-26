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
const openGlobalRoom = new Set();

const getRoom = (it) => {
  it.next();
  return it.next().value;
};
const joinRoom = (socket, room) => {
  socket.join(room);
  socket.emit("added-to-game", {
    players: Array.from(io.sockets.adapter.rooms.get(room)).map((pl) => [
      pl,
      players.get(pl),
    ]),
    roomId: room,
    paragraph: paragraphs[room % 200],
  });
  socket.to(room).emit("player-joined", [socket.id, players.get(socket.id)]);
};

const leaveRoom = (socket) => {
  const room = getRoom(socket.rooms.values());
  socket.to(room).emit("player-left", socket.id);
  const bool = openGlobalRoom.has(room);
  if (bool && io.sockets.adapter.rooms.get(room)?.size === 1) {
    openGlobalRoom.delete(room);
  } else if (room && room !== currGlobalRoom && !bool) {
    openGlobalRoom.add(room);
  }
};
io.on("connection", (socket) => {
  socket.emit("socketId", socket.id);
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
      openGlobalRoom.forEach(
        (val) =>
          60000 - (new Date().getTime() - val) < 11000 &&
          openGlobalRoom.delete(val)
      );
      const bool = openGlobalRoom.entries().next().value;
      if (bool) {
        currGlobalRoom = bool[0];
        openGlobalRoom.delete(bool[0]);
        joinRoom(socket, currGlobalRoom);
      } else {
        currGlobalRoom = new Date().getTime();
        joinRoom(socket, currGlobalRoom);
      }
    }
  });
  socket.on("leave-room", () => {
    leaveRoom(socket);
    socket.leave(getRoom(socket.rooms.values()));
  });
  socket.on("disconnecting", () => {
    leaveRoom(socket);
    players.delete(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Listening to Port: ${PORT}`);
});
