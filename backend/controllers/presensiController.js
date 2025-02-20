const Presensi = require("../models/presensiModel");

async function checkIn(req, res) {
  try {
    const { userId, locationIn, jadwal } = req.body;
    const today = new Date();
    const day = today.toLocaleDateString("id-ID", { weekday: "long" });
    const date = today.toISOString().split("T")[0];
    const checkInTime = today.toTimeString().split(" ")[0];

    const existingPresensi = await Presensi.findOne({
      userId,
      date,
    });
    if (existingPresensi) {
      return res.status(400).json({
        message: "Kamu sudah check-in hari ini",
      });
    }
    const presensi = await Presensi.create({ userId, locationIn, date, day, jadwal, checkInTime });
    res.status(201).json({ success: true, message: "Berhasil check-in", presensi });
  } catch (error) {
    console.log(error);
  }
}

async function checkOut(req, res) {
  try {
    const { userId, locationOut } = req.body;

    const today = new Date();
    const date = today.toISOString().split("T")[0];

    const presensi = await Presensi.findOne({
      userId,
      date, 
    });

    if (!presensi) {
      return res.status(400).json({
        message: "Kamu belum check-in hari ini",
      });
    }

    if (presensi.checkOutTime) {
      return res.status(400).json({
        message: "Kamu sudah check-out hari ini",
      });
    }

    presensi.locationOut = locationOut;
    presensi.checkOutTime = new Date().toTimeString().split(" ")[0];
    await presensi.save();

    res.status(200).json({ success: true, message: "Berhasil check-out", presensi });
  } catch (error) {
    console.log(error);
  }
}

async function listRiwayatPresensi(req, res) {
  try {
    const userId = req.params.id;
    const riwayatPresensi = await Presensi.find({ userId });
    if (!riwayatPresensi) res.status(400).json({ message: "Tidak ada riwayat presensi" });
    res.status(200).json({ success: true, message: "Berhasil mengambil riwayat presensi", riwayatPresensi });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { checkIn, checkOut, listRiwayatPresensi };
