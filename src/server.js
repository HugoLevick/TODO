require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mysql = require("mysql2");
const queryDatabase = require("./helpers/queryDB");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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

  io.on("connection", (socket) => {
    console.log("Un usuario se conectó:", socket.id);

    socket.on("disconnect", () => {
      console.log("Un usuario se desconectó:", socket.id);
    });
  });

  app.use(bodyParser.json()); // for parsing application/json
  app.use(express.static("public"));

  app.get("/api/tareas", async (req, res) => {
    const tareas = await queryDatabase("SELECT * FROM tasks", connection);
    res.send(tareas);
  });

  app.post("/api/tareas", async (req, res) => {
    let { title } = req.body;
    if (!title || typeof title === "number" || title.length > 100) {
      res.status(400);
      res.send({ message: "Provea un titulo valido: debe ser una cadena de texto y no debe exceder los 100 caracteres" });
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
    res.status(201);
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

    const [tarea] = await queryDatabase(`SELECT * FROM tasks WHERE tasks.id = ${id};`, connection);
    if (!tarea) {
      res.status(404);
      res.send({ message: `Tarea #${id} no encontrada` });
      return;
    }
    await queryDatabase(`UPDATE tasks SET status = 'DONE' WHERE tasks.id = ${id};`, connection);
    tarea.status = "DONE";

    io.emit("actualizar-tarea", tarea);
    res.send(tarea);
  });

  app.delete("/api/tareas/:id", async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    if (!id || isNaN(id)) {
      res.status(400);
      res.send({ message: "Provea un id valido" });
      return;
    }

    const [tarea] = await queryDatabase(`SELECT * FROM tasks WHERE tasks.id = ${id};`, connection);
    if (!tarea) {
      res.status(404);
      res.send({ message: `Tarea #${id} no encontrada` });
      return;
    }
    await queryDatabase(`DELETE FROM tasks WHERE tasks.id = ${id};`, connection);

    io.emit("borrar-tarea", id);
    res.end();
  });

  server.listen(process.env.PORT, () => {
    console.log("Aplicacion corriendo en el puerto", process.env.PORT);
  });
}
startServer();
