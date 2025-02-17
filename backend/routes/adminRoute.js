const router = require("express").Router();
const { listCutiPending, kelolaCuti, listAllUser, getUser, editUser, getAcceptedCuti, listAllAbsen } = require("../controllers/adminController");

router.put("/kelolacuti/:id", kelolaCuti);
router.get("/listcuti", listCutiPending);
router.get("/alluser", listAllUser);
router.get("/user/:id", getUser);
router.put("/edituser/:id", editUser);
router.get("/riwayatcuti", getAcceptedCuti)
router.get("/listabsen", listAllAbsen)
module.exports = router;
