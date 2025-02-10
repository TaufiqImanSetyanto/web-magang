const { register, login, logout, changePassword } = require("../controllers/authController");
const router = require("express").Router();
const { userVerification } = require("../middlewares/authMiddleware");

router.get("/", userVerification);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.put("/changepassword/:id", changePassword);

module.exports = router;
