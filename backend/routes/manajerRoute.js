const router = require("express").Router();
const {kelolaCutiFinal, listCutiSemi} = require("../controllers/manajerController");

router.get("/listcuti", listCutiSemi);
router.put("/kelolacuti/:id", kelolaCutiFinal);

module.exports = router;