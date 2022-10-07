const Mongoose = require("mongoose");

const UserSchema = Mongoose.Schema({
  name: String,
  chatrooms: [
    {
      type: Mongoose.Types.ObjectId,
      ref: "Chatroom",
    },
  ],
});

module.exports = Mongoose.model("UserTest", UserSchema);
