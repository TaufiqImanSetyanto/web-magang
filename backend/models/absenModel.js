const mongoose = require("mongoose");

const absenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  day: String,
  date: String,
  jadwal: String,
  checkInTime: String,
  checkOutTime: String,
  locationIn: {
    latitude: Number,
    longitude: Number,
  },
  locationOut: {
    latitude: Number,
    longitude: Number,
  },
});

module.exports = mongoose.model("Absen", absenSchema);
