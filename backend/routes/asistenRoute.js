const router = require("express").Router();
const {kelolaCutiSemi, listCutiPending} = require("../controllers/asistenController");

router.get("/listcuti", listCutiPending);
router.put("/kelolacuti/:id", kelolaCutiSemi);

module.exports = router;