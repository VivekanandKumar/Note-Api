const { verify } = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.authtoken;
    if (token) {
      let user = verify(token, process.env.TOKEN_SECRET);
      req.userId = user.id;
      next();
    } else {
      return res.render("error");
    }
  } catch (err) {
    console.log(err);
    return res.render("error");
  }
};

module.exports = auth;
