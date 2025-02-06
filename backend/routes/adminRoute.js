const router = require("express").Router();
const { listCutiPending, kelolaCuti } = require("../controllers/adminController");

router.put("/kelolacuti/:id", kelolaCuti);
router.get("/listcuti", listCutiPending);
module.exports = router;
