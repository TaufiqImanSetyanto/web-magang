const User = require("../models/userModel");
const Cuti = require("../models/cutiModel");

async function listCutiSemi(req, res) {
  try {
    const cutiSemi = await Cuti.find({ semiStatus: "accepted", finalStatus: "pending" }).populate("userId");
    if (!cutiSemi) {
      res.status(404).json({ message: "Tidak ada yang mengajukan cuti" });
    }
    res.status(200).json({ success: true, cutiSemi });
  } catch (error) {
    console.log(error);
  }
}
async function kelolaCutiFinal(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }
    const cuti = await Cuti.findById(id);
    if (!cuti) return res.status(404).json({ message: "Cuti not found" });

    const user = await User.findById(cuti.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (status === "accepted") {
      if ((cuti.jenisCuti.startsWith("panjang") && user.hakCuti.panjang < cuti.daysRequested) || (cuti.jenisCuti.startsWith("tahunan") && user.hakCuti.tahunan < cuti.daysRequested)) {
        return res.status(400).json({ message: "Sisa hak cuti tidak mencukupi" });
      }
      if (cuti.jenisCuti.startsWith("panjang")) {
        user.hakCuti.panjang -= cuti.daysRequested;
      }
      if (cuti.jenisCuti.startsWith("tahunan")) {
        user.hakCuti.tahunan -= cuti.daysRequested;
      }
      await user.save();
    }

    cuti.finalStatus = status;
    await cuti.save();
    res.status(200).json({ success: true, message: "Berhasil memperbarui status cuti" });
  } catch (error) {
    console.log(error);
  }
}
module.exports = { listCutiSemi, kelolaCutiFinal };
