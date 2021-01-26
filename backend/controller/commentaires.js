const sequelize = require("../database");
const { QueryTypes } = require('sequelize');

const Commentaire = require('../models/commentaire')

/* Récupérer les commentaires d'une publication */
exports.getCommentairesOnPublication = (req, res, next) => {
    sequelize.query("SELECT users.id AS author_id, users.nom AS nom, users.prenom AS prenom, users.avatarURL AS avatar, commentaires.id AS commentaire_id, commentaires.content AS content, DATE_FORMAT(date, '%d/%m/%Y à %k:%i') AS date FROM commentaires INNER JOIN users ON users.id = commentaires.author_id WHERE commentaires.publication_id = ?",
        {
            replacements: [req.params.id],
            type: QueryTypes.SELECT
        })
        .then(likes => { res.status(200).json(likes); })
        .catch(error => res.status(500).json({ error }));
}

/* Ajout d'un commentaire sur une publication */
exports.postCommentaire = (req, res, next) => {
    Commentaire.create({
        publication_id: req.body.publicationId,
        author_id: req.body.userId,
        content: req.body.content
    }).then(response => {
       res.status(201).json({
           "id": response.id,
       })
    }).catch(error => res.status(500).json({ error }));
}

/* Supprimer un commentaire */
exports.deleteCommentaire = (req, res, next) => {
    sequelize.query("DELETE FROM commentaires WHERE id = ?",
        {
            replacements: [req.params.id],
            type: QueryTypes.DELETE
        })
        .then(() => res.status(201).json({ message: "Le commentaire a bien été supprimé." }))
        .catch(error => res.status(500).json({ error }));
};
