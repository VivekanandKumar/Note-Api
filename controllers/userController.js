const Users = require("../models/User");
const { hash, compare } = require("bcrypt");
const { sign } = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // check if user exists or not
    const isUser = await Users.findOne({ email });
    if (!isUser) {
      return res.json({ message: "Invalid Credentials" });
    }
    // match the password
    const matchPassword = await compare(password, isUser.password);
    if (!matchPassword) {
      return res.json({ message: "Invalid Credentials" });
    }
    // generate the JWT token
    const token = await sign({ id: isUser._id }, process.env.TOKEN_SECRET);
    res.cookie("authtoken", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      httpOnly: true,
    });
    return res.json({ redirect: "/" });
  } catch (err) {
    console.log(err);
    return res.json({ message: "Something went wrong" });
  }
};
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // find an user with input email in database
    const isUser = await Users.findOne({ email });
    // check if user already exists
    if (isUser) {
      return res.json({ message: "User already exists" });
    }
    // hash the user input password
    const hashPassword = await hash(password, 10);
    // create/register a new user
    const newUser = await new Users({ name, email, password: hashPassword });
    await newUser.save();
    return res.json({ redirect: "/user/login" });
  } catch (err) {
    console.log(err);
    return res.json({ message: "Something went wrong!!" });
  }
};
const logout = (req, res) => {
  const token = req.cookies.authtoken;
  if (!token) {
    return res.redirect("/user/login");
  }
  try {
    res.clearCookie("authtoken");
    return res.redirect("/user/login");
    // return res.status(200).json({ message: "User Logout!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const viewlogin = (req, res) => {
  const token = req.cookies.authtoken;
  if (token) {
    return res.redirect("/");
  }
  return res.render("login", { title: "Log In", token });
};
const viewregister = (req, res) => {
  const token = req.cookies.authtoken;
  if (token) {
    return res.redirect("/");
  }
  return res.render("signup", { title: "Sign Up", token });
};
module.exports = { login, register, logout, viewlogin, viewregister };
