const express = require("express");
const formController = require("../controllers/formController");
const router = express.Router();

router.post("/addform", formController.addform);

module.exports = router;
