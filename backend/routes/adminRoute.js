const router = require("express").Router();
const { listCutiPending, kelolaCuti, listAllUser } = require("../controllers/adminController");

router.put("/kelolacuti/:id", kelolaCuti);
router.get("/listcuti", listCutiPending);
router.get("/alluser", listAllUser);
module.exports = router;
