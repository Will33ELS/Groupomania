const express = require("express");
const router = express.Router();

const commentairesController = require("../controller/commentaires");
const authMiddleware = require("../middleware/auth");

router.delete("/:id", authMiddleware.logged, commentairesController.deleteCommentaire); // Route pour supprimer un commentaire
router.post("/add", authMiddleware.logged, commentairesController.postCommentaire); // Route pour ajouter un commentaire

module.exports = router;
