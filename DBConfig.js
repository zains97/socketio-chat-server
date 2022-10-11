const {
  getMessages,
  saveMessage,
} = require("./Utilites/MessageManagment/Message");
module.exports = () => {
  require("mongoose")
    .connect(
      "mongodb+srv://zain:1234@connect.r4y9z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("Connected DB");

      // saveMessage(
      //   "63403698d6ad21ece298c3ca",
      //   "63402c77c36c5943e014a49cd",
      //   "sdafdafdf"
      // )
      //   .then((data) => {
      //     console.log(data);
      //   })
      //   .catch((err) => {
      //     console.log("false");
      //   });

      // // getMessages("63403698d6ad21ece298c3ca")
      // //   .then((data) => {
      // //     console.log(data);
      // //   })
      // //   .catch((err) => {
      // //     console.log(err);
      // //   });
    });
};
