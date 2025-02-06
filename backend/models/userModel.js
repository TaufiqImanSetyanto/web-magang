const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  hakCuti: {
    tahunan: { 
      type: Number, 
      default: 12 }, 
    panjang: { 
      type: Number, 
      default: 30 }, 
  },
  role: {
    type: String,
    enum: ["user","admin"],
    default: "user",
  },
});

module.exports = mongoose.model("User", userSchema);