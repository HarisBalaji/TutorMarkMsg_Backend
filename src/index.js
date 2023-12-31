const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
require('dotenv').config();

// settings
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use("/api", userRoute);

// routes
app.get("/", (req, res) => {
  res.send("Welcome to API");
});
// mongodb connection
mongoose
  .connect('mongodb://0.0.0.0:27017/login', { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error(error));

// server listening
app.listen(port, () => console.log("Server listening to", port));
