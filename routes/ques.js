const express = require("express");
const queController = require("../controllers/queController");
const router = express.Router();

router.post("/addque/:id", queController.addque);

module.exports = router;
