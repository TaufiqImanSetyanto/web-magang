const router = require("express").Router();
const { checkIn, checkOut, listRiwayatPresensi } = require("../controllers/presensiController");

router.post("/checkin", checkIn);
router.post("/checkout", checkOut);
router.get("/riwayatpresensi/:id", listRiwayatPresensi);

module.exports = router;
