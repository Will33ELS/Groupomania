const express = require("express");
const router = express.Router();

const publicationsController = require("../controller/publication");
const commentairesController = require("../controller/commentaires");
const authMiddleware = require("../middleware/auth");
const multerMiddleware = require("../middleware/multer-config");

router.get("/", publicationsController.getPublications); //Route pour récupérer les publications
router.get("/:id", publicationsController.getPublicationByID); //Route pour récupérer une publication
router.get("/:id/like", authMiddleware.logged, publicationsController.getLikesOnPublication); //Route pour ajouter ou supprimer un like sur une publication
router.get("/author/:user_id", authMiddleware.logged, publicationsController.getPublicationsFromUser); //Route pour récupérer les publications d'un utilisateur
router.delete("/:id", authMiddleware.logged, authMiddleware.canDelete, publicationsController.deletePublications); //Route pour supprimer une publication
router.post("/:id/like", authMiddleware.logged, publicationsController.likePublication); //Route pour ajouter ou supprimer un like sur une publication
router.post("/create", authMiddleware.logged, multerMiddleware, publicationsController.createPublication); //Route pour créer une publication

router.get("/:id/commentaires", authMiddleware.logged, commentairesController.getCommentairesOnPublication); // Route pour récupérer les commentaires

module.exports = router;
