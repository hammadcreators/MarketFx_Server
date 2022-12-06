const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");

// Importin routes
const userRoute = require("./app/routes/User");
const customerSupportRoute = require("./app/routes/CustomerSupport");
const watchlistRoute = require("./app/routes/Watchlist");

const PORT = 5000;
const app = express();
const url = "mongodb://localhost:27017/MarketFX";

// Moutin routes
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use("/user", userRoute);
app.use("/customersupport", customerSupportRoute)
app.use("/watchlist", watchlistRoute)

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
