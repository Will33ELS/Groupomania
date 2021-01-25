const express = require("express");
const router = express.Router();

const publicationsController = require("../controller/publication");
const authMiddleware = require("../middleware/auth");
const multerMiddleware = require("../middleware/multer-config");

router.get("/", publicationsController.getPublications); //Route pour récupérer les publications
router.get("/:id/like", authMiddleware.logged, publicationsController.getLikesOnPublication); //Route pour ajouter ou supprimer un like sur une publication
router.get("/:user_id", authMiddleware.logged, publicationsController.getPublicationsFromUser); //Route pour récupérer les publications d'un utilisateur
router.delete("/:id", authMiddleware.logged, publicationsController.deletePublications); //Route pour supprimer une publication
router.post("/:id/like", authMiddleware.logged, publicationsController.likePublication); //Route pour ajouter ou supprimer un like sur une publication
router.post("/create", authMiddleware.logged, multerMiddleware, publicationsController.createPublication); //Route pour créer une publication

module.exports = router;
