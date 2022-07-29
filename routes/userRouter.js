const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/auth");
const {
  login,
  register,
  logout,
  viewlogin,
  viewregister,
} = require("../controllers/userController");

userRouter.get("/login", viewlogin);
userRouter.get("/register", viewregister);
userRouter.post("/login", login);
userRouter.post("/register", register);
userRouter.get("/logout", logout);

module.exports = userRouter;
