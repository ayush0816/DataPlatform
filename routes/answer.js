const express = require("express");
const ansController = require("../controllers/ansController");
const router = express.Router();

router.post("/addans/:resId/:queId", ansController.addans);

module.exports = router;
