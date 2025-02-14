const Absen = require("../models/absenModel");

async function checkIn(req, res) {
  try {
    const { userId, locationIn, jadwal } = req.body;
    const today = new Date();
    const day = today.toLocaleDateString("id-ID", { weekday: "long" });
    const date = today.toLocaleDateString("id-ID");
    const checkInTime = today.toLocaleTimeString("id-ID");

    today.setHours(0, 0, 0, 0);

    const existingAbsen = await Absen.findOne({
      userId,
      date: today.toLocaleDateString("id-ID"),
    });
    if (existingAbsen) {
      return res.status(400).json({
        message: "Kamu sudah check-in hari ini",
      });
    }
    const absen = await Absen.create({ userId, locationIn, date, day, jadwal, checkInTime });
    res.status(201).json({ success: true, message: "Berhasil check-in", absen });
  } catch (error) {
    console.log(error);
  }
}

async function checkOut(req, res) {
  try {
    const { userId, locationOut } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const absen = await Absen.findOne({
      userId,
      date: today.toLocaleDateString("id-ID"),
    });

    if (!absen) {
      return res.status(400).json({
        message: "Kamu belum check-in hari ini",
      });
    }

    if (absen.checkOutTime) {
      return res.status(400).json({
        message: "Kamu sudah check-out hari ini",
      });
    }

    absen.locationOut = locationOut;
    absen.checkOutTime = new Date().toLocaleTimeString("id-ID");
    await absen.save();

    res.status(200).json({ success: true, message: "Berhasil check-out", absen });
  } catch (error) {
    console.log(error);
  }
}

async function listRiwayatAbsen(req, res) {
  try {
    const userId = req.params.id;
    const riwayatAbsen = await Absen.find({ userId }).populate("userId");
    if (!riwayatAbsen) res.status(400).json({ message: "Tidak ada riwayat absen" });
    res.status(200).json({ success: true, message: "Berhasil mengambil riwayat absen", riwayatAbsen });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { checkIn, checkOut, listRiwayatAbsen };
