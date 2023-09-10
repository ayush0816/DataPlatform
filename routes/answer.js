const express = require("express");
const ansController = require("../controllers/ansController");
const router = express.Router();

router.post("/addans", ansController.addans);

module.exports = router;
