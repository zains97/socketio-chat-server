const Mongoose = require("mongoose");
const { MessageSchema } = require("./Message");

const ChatroomSchema = Mongoose.Schema({
  messages: [
    {
      type: Mongoose.Types.ObjectId,
      ref: "Message",
    },
  ],
  participants: [
    {
      type: Mongoose.Types.ObjectId,
      ref: "UserTest",
    },
  ],
  lastMessage: MessageSchema,
  chatName: String,
});

module.exports = Mongoose.model("Chatroom", ChatroomSchema);
