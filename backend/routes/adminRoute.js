const router = require("express").Router();
const {  listAllUser, getUser, editUser, getAcceptedCuti, listAllPresensi } = require("../controllers/adminController");

router.get("/alluser", listAllUser);
router.get("/user/:id", getUser);
router.put("/edituser/:id", editUser);
router.get("/riwayatcuti", getAcceptedCuti)
router.get("/listpresensi", listAllPresensi)
module.exports = router;
