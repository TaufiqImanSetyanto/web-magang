const { register, login, logout } = require("../controllers/authController");
const router = require("express").Router();
const { userVerification } = require("../middlewares/authMiddleware");

router.get("/", userVerification);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout)

module.exports = router;
