const router = require("express").Router();
const { listBagian,listOffice } = require("../controllers/dataController");

router.get("/listbagian", listBagian);
router.get("/listoffice", listOffice);

module.exports = router;
