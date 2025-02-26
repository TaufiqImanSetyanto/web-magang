const mongoose = require("mongoose");

const cutiSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  sisaCuti: {
    tahunan: Number,
    panjang: Number,
  },
  jenisCuti: String,
  dates: Array,
  daysRequested: Number,
  reason: String,
  diwakilkan: String,
  asistenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  manajerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  semiStatus: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  finalStatus: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Cuti", cutiSchema);
