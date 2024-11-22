import express from "express";
import http from "http";
import socketIo from "socket.io";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("new_message", (msg) => {
    console.log("Nuevo mensaje recibido:", msg);
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Un cliente se ha desconectado");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Corriendo en: ${PORT}`);
});
