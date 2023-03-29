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
  const createQuery = await queryDatabase("CREATE DATABASE IF NOT EXISTS todolist;", connection);
  //Si la base de datos se acaba de crear
  if (createQuery.warningStatus === 0) {
    console.log("Creando base de datos...");
    await queryDatabase("CREATE TABLE `todolist`.`tasks` ( `id` INT NOT NULL AUTO_INCREMENT , `title` VARCHAR(100) UNIQUE NOT NULL , PRIMARY KEY (`id`), `status` ENUM('DONE','TODO') NOT NULL DEFAULT 'TODO');", connection);
    console.log("Base de datos creada");
  }
  await queryDatabase("USE todolist;", connection);

  app.use(bodyParser.json()); // for parsing application/json
  app.use(express.static("public"));

  app.get("/api/tareas", async (req, res) => {
    const tareas = await queryDatabase("SELECT * FROM tasks", connection);
    res.send(tareas);
  });

  app.post("/api/tareas", async (req, res) => {
    let { title } = req.body;
    if (!title || typeof title === "number") {
      res.status(400);
      res.send({ message: "Provea un titulo valido" });
      return;
    }

    let tarea = { title, status: "TODO" };
    try {
      title = title.replace(/'/gi, "\\'");
      const queryRes = await queryDatabase(`INSERT INTO tasks (title) VALUES ('${title}')`, connection);
      tarea.id = queryRes.insertId;
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        res.status(400);
        res.send({ message: "Entrada duplicada" });
        return;
      }

      res.status(500);
      res.send({ message: "Sucedio algo inesperado" });
      console.log(error);
      return;
    }
    io.emit("nueva-tarea", tarea);
    res.send(tarea);
  });

  app.patch("/api/tareas/:id", async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    if (!id || isNaN(id)) {
      res.status(400);
      res.send({ message: "Provea un id valido" });
      return;
    }

    await queryDatabase(`UPDATE tasks SET status = 'DONE' WHERE tasks.id = ${id};`, connection);
    const [tarea] = await queryDatabase(`SELECT * FROM tasks WHERE tasks.id = ${id};`, connection);

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
