const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  NIK: {
    type: String,
    required: [true, "Your NIK is required"],
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
      default: 12,
    },
    panjang: {
      type: Number,
      default: 30,
    },
  },
  tahunCuti: {
    tahunan: {
      type: String,
      default: "2025",
    },
    panjang: {
      type: String,
      default: "",
    },
  },
  bagian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bagian",
  },
  tahunPengangkatan: {
    type: String,
    default: "2000",
  },
  role: {
    type: String,
    enum: ["user", "admin", "asisten", "manajer"],
    default: "user",
  },
});

module.exports = mongoose.model("User", userSchema);
