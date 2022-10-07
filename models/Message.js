const Mongoose = require("mongoose");

let MessageSchema = Mongoose.Schema({
  messageBody: String,
  timeStamp: {
    type: Date,
    default: Date.now(),
  },
  senderId: {
    type: Mongoose.Types.ObjectId,
    ref: "UserTest",
  },
});

let Message = Mongoose.model("Message", MessageSchema);
module.exports = { MessageSchema, Message };
