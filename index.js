const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { router } = require("./router");
const cors = require("cors");
const { addUser, getUser } = require("./Users");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
require("./DBConfig")();

const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  //Event for new user joining chat
  socket.on("join", (data, callback) => {
    let { name, room } = data;
    let { error, user } = addUser({ id: socket.id, name, room });

    if (error) {
      return callback(error);
    }

    // Welcoming the user.
    socket.emit("message", {
      user: "admin",
      text: `${user.name} welcome to the room ${user.room}`,
    });

    // Telling others that the a new person has joined the chat.
    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has joined the chat`,
    });

    socket.join(user.room);
    callback();
  });

  //Event for sending a message
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });
    callback();
    console.log("From client", message);
  });

  socket.on("disconnect", () => {
    console.log("User has left");
  });
});

app.use(router);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
