const User = require("../models/userModel");
const createSecretToken = require("../util/secret_token");
const bcrypt = require("bcrypt");

async function register(req, res, next) {
  try {
    const { email, password, username, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, username, role });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({ message: "User registered successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
}
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Incorrect password or email" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({ message: "User logged in successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
}
async function logout(req, res, next) {
  try {
    res.clearCookie("token")
    res.status(200).json({ message: "User logged out successfully", success: true });
    next();
  } catch (error) {
    console.error(error);
  }
}

module.exports = { register, login, logout };
