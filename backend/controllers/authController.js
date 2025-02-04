const User = require("../models/userModel");
const createSecretToken = require("../util/secret_token");
const bcrypt = require("bcrypt");

async function register(req, res) {
  try {
    const { email, password, username } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = new User({ email, password, username });
    user.password = await bcrypt.hash(password, 12);
    await user.save();

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({ message: "User registered successfully", success: true, user });
  } catch (error) {
    console.error(error);
  }
}
async function login(req, res) {
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
    res.status(200).json({ message: "User logged in successfully", success: true, user });
  } catch (error) {
    console.error(error);
  }
}
async function logout(req, res) {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully", success: true });
  } catch (error) {
    console.error(error);
  }
}

module.exports = { register, login, logout };
