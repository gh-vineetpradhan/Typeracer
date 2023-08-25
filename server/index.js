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

io.on("connection", (socket) => {
  socket.on("generate-paragraph", () => {
    socket.emit(
      "paragraph-generated",
      paragraphs[Math.floor(Math.random() * 200)]
    );
  });
});

server.listen(PORT, () => {
  console.log(`Listening to Port: ${PORT}`);
});
