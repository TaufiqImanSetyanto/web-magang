const User = require("../models/userModel");
const Cuti = require("../models/cutiModel");

async function cuti(req, res) {
  try {
    const { userId, username, dates, jenisCuti, reason } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const daysRequested = dates.length;

    if (jenisCuti === "tahunan" && user.hakCuti.tahunan < daysRequested) {
      return res.status(400).json({ message: "Sisa hak cuti tahunanmu 0" });
    }
    if (jenisCuti === "panjang" && user.hakCuti.panjang < daysRequested) {
      return res.status(400).json({ message: "Sisa hak cuti panjangmu 0" });
    }

    const permohonanCuti = new Cuti({
      userId,
      username,
      dates,
      jenisCuti: jenisCuti === "panjang" ? `panjang ${user.tahunCuti.panjang}` : `tahunan ${user.tahunCuti.tahunan}`,
      daysRequested,
      reason,
    });
    await permohonanCuti.save();

    res.status(201).json({ message: "Permohonan cuti submitted", success: true });
  } catch (error) {
    console.log(error);
  }
}
async function riwayatCuti(req, res) {
  try {
    const userId = req.params.id;
    const cuti = await Cuti.find({ userId: userId });
    if (!cuti) {
      res.status(404).json({ message: "Tidak ada permohonan cuti" });
    }
    res.status(200).json({ success: true, cuti });
  } catch (error) {
    console.log(error);
  }
}
module.exports = { cuti, riwayatCuti };
