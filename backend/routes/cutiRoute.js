const router = require("express").Router();
const { cuti, riwayatCuti } = require("../controllers/cutiController");

router.post("/ambilcuti", cuti);
router.get("/riwayatcuti/:id", riwayatCuti);

module.exports = router;
