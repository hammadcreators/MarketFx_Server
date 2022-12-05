// name, email, passwrod, number,
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is a required field"],
    minLenth: 3,
    maxLenth: 34,
  },

  email: {
    type: String,
    required: [true, "Email is a required field"],
    unique: true,
    match:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },

  password: {
    type: String,
    required: [true, "Password is required field"],
  },

  contactNumber: {
    type: Number,
    required: [true, "Contact Number must be a number"],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
