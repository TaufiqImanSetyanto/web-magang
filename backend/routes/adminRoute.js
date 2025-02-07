const router = require("express").Router();
const { listCutiPending, kelolaCuti, listAllUser, getUser, editUser } = require("../controllers/adminController");

router.put("/kelolacuti/:id", kelolaCuti);
router.get("/listcuti", listCutiPending);
router.get("/alluser", listAllUser);
router.get("/edituser/:id", getUser);
router.put("/edituser/:id", editUser)
module.exports = router;
