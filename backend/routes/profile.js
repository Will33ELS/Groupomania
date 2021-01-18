const express = require("express");
const router = express.Router();

const multerMiddleware = require("../middleware/multer-config");
const authMiddleware = require("../middleware/auth");

const profileController = require("../controller/profile");

router.get("/", authMiddleware, profileController.myProfile); //Route pour récupérer les informations du comptes
router.post("/avatar", authMiddleware, multerMiddleware, profileController.changeAvatar); //Route pour changer d'avatar

module.exports = router;
