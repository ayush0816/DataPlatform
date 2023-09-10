const express = require("express");
const resController = require("../controllers/resController");
const fetchUser = require("../middlewares/fetchUser");
const router = express.Router();

router.post("/addres/:formId", fetchUser, resController.addres);

module.exports = router;
