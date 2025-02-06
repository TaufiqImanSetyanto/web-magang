const User = require("../models/userModel");
const Cuti = require("../models/cutiModel");

async function listCutiPending(req, res, next) {
  try {
    const cutiPending = await Cuti.find({ status: "pending" });
    if (!cutiPending) {
      res.status(404).json({ message: "Tidak ada yang mengajukan cuti" });
    }
    res.status(200).json({ success: true, cutiPending });
    next();
  } catch (error) {
    console.log(error);
  }
}
async function kelolaCuti(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }
    const cuti = await Cuti.findByIdAndUpdate(id, { status }, { new: true });
    if (!cuti) {
      return res.status(404).json({ message: "Cuti not found" });
    }
    if (cuti.status === "accepted") {
      const user = await User.findById(cuti.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      if (cuti.jenisCuti === "tahunan" && user.hakCuti.tahunan >= cuti.daysRequested) {
        user.hakCuti.tahunan -= cuti.daysRequested;
      } else if (cuti.jenisCuti === "panjang" && user.hakCuti.panjang >= cuti.daysRequested) {
        user.hakCuti.panjang -= cuti.daysRequested;
      } else {
        return res.status(400).json({ message: "Hak cuti 0" });
      }
      await user.save();
    }
    res.status(200).json({ success: true, message: "Berhasil memperbarui status cuti" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
module.exports = { listCutiPending, kelolaCuti };
