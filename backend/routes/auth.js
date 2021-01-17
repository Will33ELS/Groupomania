const express = require("express");
const router = express.Router();

const authController = require("../controller/auth");

router.post("/login", authController.signin);
router.post("/register", authController.signup);

module.exports = router;
