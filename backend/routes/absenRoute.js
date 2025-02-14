const router = require("express").Router();
const { checkIn, checkOut, listRiwayatAbsen } = require("../controllers/absenController");

router.post("/checkin", checkIn);
router.post("/checkout", checkOut);
router.get("/riwayatabsen/:id", listRiwayatAbsen);

module.exports = router;
