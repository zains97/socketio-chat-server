const { Message } = require("../../models/Message");
const Chatroom = require("../../models/Chatroom");

async function saveMessage(chatroomId, senderId, messageBody) {
  var flag = false; //Iska return type check karo
  let message = new Message();

  message.messageBody = messageBody;
  message.senderId = senderId;
  await message.save();
  let chatroom = await Chatroom.findOne({ _id: chatroomId });
  chatroom.messages = [...chatroom.messages, message._id];
  chatroom.lastMessage = message;
  await chatroom.save();
  return true;
}

async function getMessages(chatroomId) {
  console.log("Chat id", chatroomId);

  let data = await Chatroom.findById(chatroomId).populate("messages");

  return data;
}

module.exports = { saveMessage, getMessages };
