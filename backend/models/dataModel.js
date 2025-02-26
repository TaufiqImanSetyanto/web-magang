const mongoose = require("mongoose");

const bagianSchema = new mongoose.Schema({
  name: String,
  bawahan: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bagian" }],
});
const officeSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  allowedDistance: Number,
});

const Bagian = mongoose.model("Bagian", bagianSchema);
const Office = mongoose.model("Office", officeSchema);
module.exports = { Bagian, Office };
