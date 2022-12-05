const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");

// Importin routes
const userRoute = require("./app/routes/User");

const PORT = 5000;
const app = express();
const url = "mongodb://localhost:27017";

// Moutin routes
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use("/user", userRoute);

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to the db");
  })
  .catch((err) => {
    console.log("Failed to connect to the db");
  });

app.listen(PORT, () => {
  console.log("server has started");
});
