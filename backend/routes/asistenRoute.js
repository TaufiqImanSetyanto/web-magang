const router = require("express").Router();
const {kelolaCutiSemi, listCutiPending} = require("../controllers/asistenController");

router.post("/listcuti", listCutiPending);
router.put("/kelolacuti/:id", kelolaCutiSemi);

module.exports = router;