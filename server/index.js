const express = require("express");

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello World");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Listening to Port: ${PORT}`);
});
