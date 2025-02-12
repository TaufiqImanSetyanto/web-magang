const mongoose = require("mongoose");

const cutiSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  username:{
    type: mongoose.Schema.Types.String,
    ref: "User"
  },
  jenisCuti: String,
  dates: Array,
  daysRequested: Number,
  reason: String,
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Cuti", cutiSchema);
