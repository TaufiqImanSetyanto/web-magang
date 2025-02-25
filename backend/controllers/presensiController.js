const Presensi = require("../models/presensiModel");
const { DateTime } = require("luxon");

async function checkIn(req, res) {
  try {
    const { userId, locationIn, jadwal, addressIn } = req.body;
    const today = DateTime.now().setZone("Asia/Jakarta").setLocale("id");
    const day = today.toFormat("EEEE");
    const date = today.toISODate();
    const checkInTime = today.toFormat("HH:mm:ss");

    const existingPresensi = await Presensi.findOne({
      userId,
      date,
    });
    if (existingPresensi) {
      return res.status(400).json({
        message: "Kamu sudah check-in hari ini",
      });
    }
    const presensi = await Presensi.create({ userId, locationIn, date, day, jadwal, checkInTime, addressIn });
    return res.status(201).json({ success: true, message: "Berhasil check-in", presensi });
  } catch (error) {
    console.log(error);
  }
}

async function checkOut(req, res) {
  try {
    const { userId, locationOut, jadwal, addressOut } = req.body;
    const today = DateTime.now().setZone("Asia/Jakarta").setLocale("id");
    const date = today.toISODate();
    const yesterdayDate = today.minus({ days: 1 }).toISODate();
    const checkOutTime = today.toFormat("HH:mm:ss");

    if (jadwal === "Shift Malam") {
      const presensi = await Presensi.findOne({ userId, date: yesterdayDate, jadwal: "Shift Malam" });
      if (!presensi) {
        return res.status(400).json({
          message: "Kamu belum check-in",
        });
      }
      if (presensi.checkOutTime) {
        return res.status(400).json({
          message: "Kamu sudah check-out",
        });
      }
      presensi.locationOut = locationOut;
      presensi.addressOut = addressOut;
      presensi.checkOutTime = checkOutTime;
      await presensi.save();
  
      return res.status(200).json({ success: true, message: "Berhasil check-out", presensi });
    }

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
    presensi.addressOut = addressOut;
    presensi.checkOutTime = checkOutTime;
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
    return res.status(200).json({ success: true, message: "Berhasil mengambil riwayat presensi", riwayatPresensi });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { checkIn, checkOut, listRiwayatPresensi };
