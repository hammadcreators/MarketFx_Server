require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

// importin the models
const User = require("../models/User");
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

module.exports = userRouter;
