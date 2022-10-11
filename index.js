const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { router } = require("./router");
const cors = require("cors");
const {
  saveMessage,
  getMessages,
} = require("./Utilites/MessageManagment/Message");

const myurl = "10.14.6.81:5000";

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
    let { userId, chatroomId } = data;

    console.log(userId + "  " + chatroomId);
    socket.join(chatroomId);
    callback();
    //  let { error, user } = addUser({ id: socket.id, userId, chatRoomId });

    // if (error) {
    //   return callback(error);
    // }

    // Welcoming the user.
    // socket.emit("message", {
    //   user: "admin",
    //   text: `${userId} welcome to the room ${chatroomId}`,
    // });

    // Telling others that the a new person has joined the chat.
    // socket.broadcast.to(user.room).emit("message", {
    //   user: "admin",
    //   text: `${user.name} has joined the chat`,
    // });
  });

  //Event for sending a message
  socket.on("sendMessage", (data, callback) => {
    // const user = getUser(socket.id);
    let { userId, chatroomId, message } = data;
    saveMessage(chatroomId, userId, message)
      .then((data) => {
        io.to(chatroomId).emit("broadcastMessage", {
          userId,
          message,
        });
        callback(data);
      })

      .catch((e) => {
        callback({ success: false, message: "Saving Failed" });
      });

    // io.to(user.room).emit("message", { user: user.name, text: message });
    // callback();
    // console.log("From client", message);
  });

  socket.on("disconnect", () => {
    console.log("User has left");
  });
});

app.use(router);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
