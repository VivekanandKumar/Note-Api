const Users = require("../models/User");
const { hash, compare } = require("bcrypt");
const { sign, verify } = require("jsonwebtoken");
const nodemailer = require('nodemailer')

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
  res.clearCookie('forgotPassToken');
  res.clearCookie('authtoken');
  return res.render("login", { title: "Log In", token });
};

const viewregister = (req, res) => {
  const token = req.cookies.authtoken;
  if (token) {
    return res.redirect("/");
  }
  return res.render("signup", { title: "Sign Up", token });
};

const viewForgotPassword = (req, res) => {
  return res.render("forgotpassword", { title: "Forgot Password", token: undefined });
};

const sendForgotPasswordEmail = async (req, res) => {
  try {
    if (!req.body.email) return res.status(502).json({ mag: 'Parameter Missing' });
    const userCount = await Users.countDocuments({ email: req.body.email });
    if (!userCount) throw new Error("User doesn't Exists!");
    const code = generateOTP(6);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // upgrade later with STARTTLS
      auth: {
        user: "mailofvivekanand@gmail.com",
        pass: "mrej inkg dqln qpnt",
      },
    });

    try {
      const mail = await transporter.sendMail({
        from: {
          name: 'NoteKeeper',
          address: 'mailofvivekanand@gmail.com'
        },
        to: req.body.email,
        subject: 'Forgot Password Verification Code',
        html: '<p>Your Forgot Password Verification Code is</p><h3 style="text-align:center;">' + code + '</h3>'
      })
      if (mail) {
        const token = await sign({ code, email: req.body.email }, process.env.TOKEN_SECRET);
        res.cookie("forgotPassToken", token, {
          expires: new Date(Date.now() + 1000 * 60 * 10), // 10 Min valid
          httpOnly: true,
        });
        return res.status(200).json({ status: 0, msg: 'OTP Sent on ' + mail.accepted.join(',') })
      } else {
        throw new Error('Something Went Wrong');
      }
    } catch (error) {
      throw new Error(error.message)
    }
  } catch (error) {
    return res.status(500).json({ status: 1, msg: error.message })
  }
}

const setNewPassword = async (req, res) => {
  try {
    const { code, password } = req.body;
    if (!code || !password) throw new Error('Parameter Missing');
    const token = req.cookies.forgotPassToken;
    if (!token) throw new Error('Something Went Wrong');

    const payload = verify(token, process.env.TOKEN_SECRET);
    if (code !== payload.code) throw new Error('Invalid OTP Code');
    try {
      const hashPassword = await hash(password, 10);
      await Users.findOneAndUpdate({ email: payload.email }, { $set: { password: hashPassword } });
      res.clearCookie("forgotPassToken");
      res.clearCookie("authtoken");
      return res.status(200).json({ status: 0, msg: 'Password Changed' });
    } catch (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    return res.status(500).json({ status: 1, msg: error.message })
  }

}

function generateOTP(length) {
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
module.exports = { login, register, logout, viewlogin, viewregister, viewForgotPassword, sendForgotPasswordEmail, setNewPassword };
