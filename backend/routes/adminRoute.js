const router = require("express").Router();
const { listCutiPending, kelolaCuti, listAllUser, getUser, editUser, getAcceptedCuti, listAllPresensi } = require("../controllers/adminController");

router.put("/kelolacuti/:id", kelolaCuti);
router.get("/listcuti", listCutiPending);
router.get("/alluser", listAllUser);
router.get("/user/:id", getUser);
router.put("/edituser/:id", editUser);
router.get("/riwayatcuti", getAcceptedCuti)
router.get("/listpresensi", listAllPresensi)
module.exports = router;
