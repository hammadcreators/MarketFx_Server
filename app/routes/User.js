require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

// importing the models
const User = require("../models/User");
const ChatModel = require("../models/Chat");
const MessageModel = require('../models/Message');
const ComplaintModel = require('../models/Complaint');
const authMidddlware = require("../middlewares/authMiddleware");

const userRouter = express.Router();

// Register the user
userRouter.post("/register", async (req, res) => {
  console.log("RAN");
  let { name, password, email, contactNumber } = req.body;
  try {
    console.log({ name, password, email, contactNumber });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    password = hash;
    const newUser = await User.create({
      name: name,
      password: password,
      email: email,
      contactNumber: contactNumber,
    });

    // Creattin a token
    const token = jwt.sign({ user: newUser }, SECRET_KEY);
    res.status(201).json({
      message: "User has been registered",
      info: newUser,
      token: token,
    });
  } catch (ex) {
    console.log(ex.message);
    res.status(400).json({ message: ex.message });
  }
});

// Login the user
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    // If user is not found
    if (!user) return res.status(401).json({ message: "User not found" });

    // If the user is found compare the passwords
    const match = await bcrypt.compare(password, user.password);

    // If the passwor didnt match
    if (!match) return res.status(401).json({ message: "Password mismatch" });
    const token = jwt.sign({ user: user }, SECRET_KEY);
    // If the password matched
    return res
      .status(200)
      .json({ message: "User found", info: user, token: token });
  } catch (ex) {
    res.status(400).json({ message: ex.message });
  }
});

// get the user...
userRouter.get("/me", authMidddlware, async (req, res) => {
  const user = req.user;
  return res.status(200).json({ message: "User found", user: user });
});

// Update the user..
userRouter.patch("/update", authMidddlware, async (req, res) => {
  const { name, password, email, contactNumber } = req.body;
  const user = req.user;
  const obj = {};

  // If the provided fields are empty
  if (name) obj.name = name;
  // if password is found in the body we will first hash it.....
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    obj.password = hash;
  }
  if (email) obj.email = email;
  if (contactNumber) obj.contactNumber = contactNumber;

  const updatedUser = Object.assign(user, obj);
  try {
    const dbUpdatedUser = await User.findOneAndUpdate(
      { _id: updatedUser._id },
      updatedUser,
      { new: true }
    );
    return res
      .status(201)
      .json({ message: "User has been updated", info: dbUpdatedUser });
  } catch (ex) {
    res.status(400).json({ message: ex.message });
  }
});

// delete the user
userRouter.delete("/delete", authMidddlware, async (req, res) => {
  const user = req.user;

  try {
    const deletedUser = await User.findByIdAndDelete(user._id);
    res.status(200).json({
      message: "User has been deleted successfully",
      info: deletedUser,
    });
  } catch (ex) {
    res.status(400).json({ message: ex.message });
  }
});

userRouter.post("/contactCustomerSupport/:uid", async (req, res) => {

  if(User.findOne({_id: req.params.uid}) == null){
    res.writeHead(404, "User does not exists");
    res.end();
  }

  let chat = await ChatModel.findOne({UserId: req.params.uid, IsOpen: true});

  if(chat == null){
    chat = await ChatModel.create({UserId: req.params.uid});
  }

  req.body["SenderId"] = req.params.uid;
  req.body["SenderType"] = "User";
  req.body["SentDate"] = Date.now();
  let message = await MessageModel.create(req.body);
  chat.MessageIds.push(message._id);
  chat.save();
  res.writeHead(200, "Message sent successfully");
  res.end();
});

userRouter.get("/chats/:uid", async (req, res) => {

  if(await User.findOne({_id: req.params.uid}) == null){
    res.writeHead(404, "User does not exists");
    res.end();
    return;
  }

  let chats = await ChatModel.find({UserId: req.params.uid}).populate("MessageIds");
  res.writeHead(400);
  res.write(JSON.stringify(chats));
  res.end();
});

userRouter.get("/chat/:cid", async (req, res) => {
  let chat = await ChatModel.findOne({_id: req.params.cid}).populate("MessageIds");
  if (chat == null) {
    res.writeHead(404, "Chat not found");
    res.end();
    return;
  }
  res.writeHead(200);
  res.write(JSON.stringify(chat));
  res.end();
});

userRouter.put("/closechat/:id",async (req, res) => {
  let chat = await ChatModel.findOne({_id: req.params.id, IsOpen: true});
  if(chat == null){
    res.writeHead(404, "No open chat found");
    res.end();
    return;
  }
  await ChatModel.updateOne({_id: req.params.id}, {$set: {IsOpen: false}});
  res.writeHead(200);
  res.write("Chat closed successfully");
  res.end();
});

userRouter.post("/register-complaint/:uid", async (req, res) => {
  let user = await User.findOne({_id: req.params.uid});
  if(user == null){
    res.writeHead(404, "User not found");
    res.end();
    return;
  }
  req.body["UserId"] = req.params.uid;
  req.body["SubmissionDate"] = Date.now();
  let complaint = await ComplaintModel.create(req.body);
  res.writeHead(200, "Complaint Registered Successfully");
  res.write(JSON.stringify(complaint));
  res.end();
});

userRouter.get("/complaints/:uid", async (req, res) => {
  let user = await User.findOne({_id: req.params.uid});
  if(user == null){
    res.writeHead(404, "User not found");
    res.end();
    return;
  }
  let complaint = await ComplaintModel.find({UserId: req.params.uid});
  res.writeHead(200);
  res.write(JSON.stringify(complaint));
  res.end();
});

userRouter.get("/complaint/:uid/:cid", async (req, res) => {
  let user = await User.findOne({_id: req.params.uid});
  if(user == null){
    res.writeHead(404, "User not found");
    res.end();
    return;
  }
  let complaint = await ComplaintModel.findOne({_id: req.params.cid});

  if(complaint == null){
    res.writeHead(404, "Complaint not found");
    res.end();
    return;
  }

  res.writeHead(200);
  res.write(JSON.stringify(complaint));
  res.end();
});


module.exports = userRouter;
