const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

const authController = require("../controller/auth");

router.post("/login", authController.signin); //Route de connexion
router.post("/register", authController.signup); //Route d'inscription
router.post("/unregister", authMiddleware.logged, authController.unregister); //Route de désincription
router.post("/password", authMiddleware.logged, authController.password); //Route de changement du mot de passe

module.exports = router;
