require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connect } = require("mongoose");
const userRoute = require("../routes/userRouter");
const noteRoute = require("../routes/noteRouter");
const app = express();

// Database Connection
connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Database Connection established");
  })
  .catch((err) => {
    console.log(err);
  });

// middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/user", userRoute);
app.use("/", noteRoute);

app.set("view engine", "ejs");
// server configuration
const PORT = process.env.PORT || 8080;
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server running on port ${PORT}`);
});
