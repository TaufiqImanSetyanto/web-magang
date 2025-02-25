const User = require("../models/userModel");
const Cuti = require("../models/cutiModel");
const Presensi = require("../models/presensiModel");

async function listAllUser(req, res) {
  try {
    const allUser = await User.find({ role: { $ne: "admin" } }).populate("bagian");
    if (!allUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, allUser });
  } catch (error) {
    console.log(error);
  }
}
async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("bagian");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
  }
}
async function editUser(req, res) {
  try {
    const { id } = req.params;
    const { username, NIK, bagian, tahunPengangkatan, hakCuti, tahunCuti, role } = req.body;
    const user = await User.findByIdAndUpdate(id, { username, NIK, bagian, tahunPengangkatan, hakCuti, tahunCuti, role }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, message: "Berhasil memperbarui user" });
  } catch (error) {
    console.log(error);
  }
}

async function listAcceptedCuti(req, res) {
  try {
    const acceptedCuti = await Cuti.find({ finalStatus: "accepted" }).populate({ path: "userId", populate: { path: "bagian" } });
    if (!acceptedCuti) return res.status(404).json({ message: "Cuti not found" });
    res.status(200).json({ success: true, acceptedCuti });
  } catch (error) {
    console.log(error);
  }
}

async function listAllPresensi(req, res) {
  try {
    const presensi = await Presensi.find().populate({ path: "userId", populate: { path: "bagian" } });
    if (!presensi) return res.status(404).json({ message: "Presensi not found" });
    res.status(200).json({ success: true, presensi });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listAllUser, getUser, editUser, listAcceptedCuti, listAllPresensi };
