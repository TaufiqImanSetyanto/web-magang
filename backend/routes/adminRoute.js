const router = require("express").Router();
const {  listAllUser, getUser, editUser, listAcceptedCuti, listAllPresensi } = require("../controllers/adminController");
const { deleteUser } = require("../controllers/authController");

router.get("/alluser", listAllUser);
router.get("/user/:id", getUser);
router.put("/edituser/:id", editUser);
router.get("/riwayatcuti", listAcceptedCuti)
router.get("/listpresensi", listAllPresensi)
router.delete("/deleteuser/:id", deleteUser);

module.exports = router;
