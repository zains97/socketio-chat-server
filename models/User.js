const Mongoose = require("mongoose");
const deepPopulate = require("mongoose-deep-populate")(Mongoose);

const UserSchema = Mongoose.Schema({
  name: String,
  chatrooms: [
    {
      type: Mongoose.Types.ObjectId,
      ref: "Chatroom",
    },
  ],
});

UserSchema.plugin(deepPopulate);

module.exports = Mongoose.model("UserTest", UserSchema);
