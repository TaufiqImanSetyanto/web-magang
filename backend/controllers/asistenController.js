const User = require("../models/userModel");
const Cuti = require("../models/cutiModel");
const { Bagian } = require("../models/dataModel");

async function listCutiPending(req, res) {
  try {
    const { bagian } = req.body;
    if (!bagian) {
      return res.status(400).json({ message: "Bagian tidak ditemukan" });
    }
    const bagianData = await Bagian.findOne(bagian).populate("bawahan");
    const bawahanNames = [bagianData.name, ...bagianData.bawahan.map((b) => b.name)];
    const atasan = await Bagian.findOne({ bawahan: bagianData._id });
    bawahanNames.push(atasan.name);

    const cutiPending = await Cuti.find({ semiStatus: "pending" })
      .populate({ path: "userId", populate: { path: "bagian" } })
      .then((cutiList) => {
        return cutiList.filter((cuti) => {
          return bawahanNames.includes(cuti.userId?.bagian.name);
        });
      });
    if (!cutiPending) {
      res.status(404).json({ message: "Tidak ada yang mengajukan cuti" });
    }
    res.status(200).json({ success: true, cutiPending });
  } catch (error) {
    console.log(error);
  }
}
async function kelolaCutiSemi(req, res) {
  try {
    const { id } = req.params;
    const { status, asisten } = req.body;

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
    }

    cuti.semiStatus = status;
    cuti.asisten = asisten;
    if (status === "rejected") {
      cuti.finalStatus = status;
    }
    await cuti.save();
    res.status(200).json({ success: true, message: "Berhasil memperbarui status cuti" });
  } catch (error) {
    console.log(error);
  }
}
module.exports = { listCutiPending, kelolaCutiSemi };
