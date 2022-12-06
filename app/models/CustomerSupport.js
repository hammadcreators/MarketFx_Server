const mongoose = require("mongoose");

const CustomerSupportSchema = new mongoose.Schema({
  // name price, description duration

  name: {
    type: String,
    required: [true, "Name is a required field"],
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

});

module.exports = mongoose.model("CustomerSupport", CustomerSupportSchema);
