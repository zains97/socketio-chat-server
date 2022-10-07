module.exports = () => {
  require("mongoose")
    .connect(
      "mongodb+srv://zain:1234@connect.r4y9z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("Connected DB");
    });
};
