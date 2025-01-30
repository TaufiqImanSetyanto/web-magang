const { register, login } = require("../controllers/authController");
const router = require("express").Router();
const userVerification = require("../middlewares/authMiddleware");

router.post("/", userVerification);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
