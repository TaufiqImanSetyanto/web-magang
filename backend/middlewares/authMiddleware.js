const User = require("../models/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

function userVerification(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      if (user) return res.json({ status: true, user } );
      else return res.json({ status: false });
    }
  });
}

function roleVerification(req, res, next) {
  const role = req.user.role;
  if (role != "admin") {
    return res.status(403).send("Access denied");
  }
  next();
}

module.exports = { roleVerification, userVerification };
