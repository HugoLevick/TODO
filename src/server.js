const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mysql = require("mysql2");
const queryDatabase = require("./helpers/queryDB");
require("dotenv").config();

async function startServer() {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  connection.connect();
  await queryDatabase("CREATE DATABASE IF NOT EXISTS todolist;", connection);
  await queryDatabase("USE todolist;", connection);

  app.use(bodyParser.json()); // for parsing application/json
  app.use(express.static("public"));

  app.post("/api/tareas", (req, res) => {
    const { title } = req.body;
    if (!title || typeof title === "number") {
      res.status(400);
      res.send({ message: "Provea un titulo valido" });
      return;
    }

    const tarea = { id: 1, title };
    io.emit("nueva-tarea", tarea);
    res.send(tarea);
  });

  io.on("connection", (socket) => {
    console.log("user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  server.listen(process.env.PORT, () => {
    console.log("listening on " + process.env.PORT);
  });
}
startServer();
