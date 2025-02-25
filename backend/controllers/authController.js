const User = require("../models/userModel");
const createSecretToken = require("../util/secret_token");
const bcrypt = require("bcrypt");

async function register(req, res) {
  try {
    const { NIK, password, bagian, username, role } = req.body;
    const existingUser = await User.findOne({ NIK });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({ NIK, password, bagian, username, role });
    user.password = await bcrypt.hash(password, 12);
    await user.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
  }
}
async function login(req, res) {
  try {
    const { NIK, password } = req.body;
    if (!NIK || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ NIK }).populate("bagian");
    if (!user) {
      return res.status(400).json({ message: "Incorrect NIK" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "User logged in successfully", success: true, user });
  } catch (error) {
    console.error(error);
  }
}
async function logout(req, res) {
  try {
    res.clearCookie("token", {
      withCredentials: true,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "User logged out successfully", success: true });
  } catch (error) {
    console.error(error);
  }
}
async function changePassword(req, res) {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password lama salah" });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.status(200).json({ success: true, message: "Password berhasil diperbarui" });
  } catch (error) {
    console.log(error);
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { register, login, logout, changePassword, deleteUser };
