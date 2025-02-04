const User = require("../models/userModel");
const Cuti = require("../models/cutiModel");

async function cuti(req, res) {
  try {
    const { userId, startDate, endDate, jenisCuti, reason } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const daysRequested = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
    if (daysRequested < 0) {
      return res.json({ message: "Error days request" });
    }
    if (jenisCuti === "tahunan" && user.hakCuti.tahunan < daysRequested) {
      return res.status(400).json({ message: "Insufficient annual leave balance" });
    }
    if (jenisCuti === "panjang" && user.hakCuti.panjang < daysRequested) {
      return res.status(400).json({ message: "Insufficient long leave balance" });
    }

    const permohonanCuti = new Cuti({ userId, startDate, endDate, jenisCuti, daysRequested, reason });
    await permohonanCuti.save();

    if (jenisCuti === "tahunan") user.hakCuti.tahunan -= daysRequested;
    if (jenisCuti === "panjang") user.hakCuti.panjang -= daysRequested;
    await user.save();

    res.status(200).json({ message: "Leave request submitted successfully", success: true });
  } catch (error) {
    console.log(error);
  }
}
async function riwayatCuti(req, res) {
  try {
    const userId = req.params.id;
    console.log(userId)
    const cuti = await Cuti.find({ userId: userId })
    if(!cuti){
      res.status(404).json({message: "No leave request"})
    }
    res.status(200).json({success: true, cuti})
  } catch (error) {
    console.log(error);
  }
}
module.exports = { cuti, riwayatCuti };
