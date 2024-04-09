const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/auth");
const {
  login,
  register,
  logout,
  viewlogin,
  viewregister,
  viewForgotPassword, sendForgotPasswordEmail,
  setNewPassword
} = require("../controllers/userController");

userRouter.get("/login", viewlogin);
userRouter.get("/register", viewregister);
userRouter.get('/forgotpassword', viewForgotPassword)
userRouter.post('/sendForgotEmail', sendForgotPasswordEmail);
userRouter.post("/login", login);
userRouter.post("/register", register);
userRouter.get("/logout", logout);
userRouter.post('/setNewPassword', setNewPassword);

module.exports = userRouter;
