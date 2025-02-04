const mongoose = require("mongoose");

const cutiSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  jenisCuti: {
    type: String,
    enum: ["tahunan", "panjang"],
  },
  startDate: Date,
  endDate: Date,
  daysRequested: Number,
  reason: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Cuti", cutiSchema);
