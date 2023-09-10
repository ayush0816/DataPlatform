const express = require("express");
const resController = require("../controllers/resController");
const router = express.Router();

router.post("/addres", resController.addres);

module.exports = router;
