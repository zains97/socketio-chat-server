const express = require("express");
const User = require("./models/User");
const { Message } = require("./models/Message");
const Chatroom = require("./models/Chatroom");
const { findByIdAndUpdate } = require("./models/User");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hello from express!",
  });
});

//create user
router.post("/user/create", (req, res) => {
  let { name } = req.body;
  console.log("Running");

  let user = new User();
  user.name = name;
  user.save((err) => {
    if (!err) {
      res.json({
        success: true,
        user,
      });
    } else {
      res.json({
        success: false,
        error: err,
      });
    }
  });
});

//Create chatroom
router.post("/chatroom/create", (req, res) => {
  let { participants, chatName } = req.body;
  participants = participants.sort();
  // Validation is Required
  Chatroom.find({ participants: participants }, (err, chatroom) => {
    if (!err) {
      if (chatroom.length > 0) {
        res.json({
          success: false,
          message: "Could not create new chat",
        });
      } else {
        let chatroom = new Chatroom();
        chatroom.chatName = chatName;
        chatroom.participants = participants;
        chatroom.save((err) => {
          if (!err) {
            participants.forEach((element) => {
              User.findOne(
                {
                  _id: element,
                },
                (err, user) => {
                  if (!err) {
                    user.chatrooms = [...user.chatrooms, chatroom._id];
                    user.save();
                  } else {
                    res.json({ success: false });
                  }
                }
              );
            });

            res.json({ success: true, chatroom });
          } else {
            res.json({
              success: false,
              err,
            });
          }
        });
      }
    } else {
      res.json({
        success: false,
        message: "Something went wrong",
      });
    }
  });
});

//Join chatroom
router.post("/chatroom/join", (req, res) => {
  let { userId, chatroomId } = req.body;
  let tempUser;
  console.log(userId, chatroomId);

  User.findOne(
    {
      _id: userId,
    },
    (err, user) => {
      if (!err) {
        if (user.chatrooms.includes(chatroomId)) {
          res.json({
            success: false,
            message: "Already in the requested chat",
          });
        } else {
          user.chatrooms = [...user.chatrooms, chatroomId];
          user.save((err) => {
            if (!err) {
              tempUser = user;
              Chatroom.findOne({ _id: chatroomId }, (err, chatroom) => {
                if (!err) {
                  if (chatroom.participants.includes(userId)) {
                    res.json({
                      success: false,
                      message: "Already in the requested chat",
                    });
                  } else {
                    chatroom.participants = [...chatroom.participants, userId];
                    chatroom.save((err) => {
                      if (!err) {
                        res.json({
                          success: true,
                          user: tempUser,
                          chatroom,
                        });
                      } else {
                        res.json({
                          success: false,
                        });
                      }
                    });
                  }
                } else {
                  res.json({ success: false });
                }
              });
              // res.json({ success: true, user });
            } else {
              res.json({ success: false });
            }
          });
        }
      } else res.json(err);
    }
  );

  // try {
  //   let chatUpdated = Chatroom.updateOne(
  //     { _id: chatroomId },
  //     {
  //       $push: { participants: userId },
  //     }
  //   );

  //   if (chatUpdated) {
  //     let userUpdated = User.updateOne(
  //       { _id: userId },
  //       {
  //         $push: { chatrooms: chatroomId },
  //       }
  //     );

  //     if (userUpdated) {
  //       res.json({
  //         success: true,
  //         message: "User added to chatoom",
  //       });
  //     } else {
  //       res.json({
  //         success: false,
  //         message: "Failed to updated user",
  //       });
  //     }
  //   } else {
  //     res.json({
  //       success: false,
  //       message: "Failed to updated user",
  //     });
  //   }

  //   User.findByIdAndUpdate(
  //     { _id: userId },
  //     { $push: { chatrooms: chatroomId } }
  //   );

  //   res.json({
  //     success: true,
  //   });
  // } catch (error) {
  //   res.json({
  //     success: false,
  //     error,
  //   });
  // }
});

//Send message
router.post("/message/send", (req, res) => {
  let { messageBody, senderId, chatroomId } = req.body;
  let message = new Message();
  message.messageBody = messageBody;
  message.senderId = senderId;
  message.save((err) => {
    if (!err) {
      Chatroom.findOne({ _id: chatroomId }, (err, chatroom) => {
        if (!err) {
          if (!chatroom.messages.includes(message._id)) {
            chatroom.messages = [...chatroom.messages, message._id];
            chatroom.save((err) => {
              res.json({
                success: true,
                chatroom,
                message,
              });
            });
          } else {
            res.json({
              success: false,
            });
          }
        }
      });
    } else {
      res.json({
        success: false,
      });
    }
  });
  console.log(message.id);
  // Chatroom.findOne({ _id: chatroomId }, (err, chatroom) => {
  //   if (!err) {
  //     console.log(message._id);
  //     if (chatroom.messages.includes(message._id)) {
  //       res.json({
  //         success: false,
  //         message: "Already in the requested chat",
  //       });
  //     } else {
  //       chatroom.messages = [...chatroom.messages, message._id];
  //       chatroom.save((err) => {
  //         if (!err) {
  //           res.json({
  //             success: true,
  //             message: message,
  //             chatroom,
  //           });
  //         } else {
  //           res.json({
  //             success: false,
  //           });
  //         }
  //       });
  //     }
  //   } else {
  //     res.json({ success: false });
  //   }
  // });

  // res.send("ok");
});

//Chat all chatrooms for a user
router.get("/get-chatroom-user", (req, res) => {
  let { userId } = req.body;

  User.findById(userId)
    .deepPopulate("chatrooms.participants")
    .exec((err, user) => {
      res.send(user);
    });
});

exports.router = router;
