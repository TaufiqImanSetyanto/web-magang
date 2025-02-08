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
      if (cuti.jenisCuti === "tahunan") {
        user.hakCuti.tahunan -= cuti.daysRequested;
      }
      if (cuti.jenisCuti === "panjang") {
        user.hakCuti.panjang -= cuti.daysRequested;
      }
      await user.save();
    }
    res.status(200).json({ success: true, message: "Berhasil memperbarui status cuti" });
  } catch (error) {
    console.log(error);
  }
}
async function listAllUser(req, res) {
  try {
    const allUser = await User.find({ role: "user" });
    if (!allUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, allUser });
  } catch (error) {
    console.log(error);
  }
}
async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
  }
}
async function editUser(req, res) {
  try {
    const { id } = req.params;
    const { username, email, bagian, hakCuti } = req.body;
    const user = await User.findByIdAndUpdate(id, { username, email, bagian, hakCuti }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({success: true ,message: "Berhasil memperbarui status cuti"})
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listCutiPending, kelolaCuti, listAllUser, getUser, editUser };
