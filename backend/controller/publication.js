const sequelize = require("../database");
const { QueryTypes } = require('sequelize');

const Publication = require("../models/publication");
const Likes = require("../models/likes");
const userUtil = require("../utils/userUtils");

/* RETOURNE LES PUBLICATIONS DANS L'ORDRE DECROISSANT */
exports.getPublications = (req, res, next) => {
    sequelize.query("SELECT users.id as author_id, users.nom as nom, users.prenom as prenom, users.avatarURL as avatar, publications.id as publication_id, publications.content as content, publications.attachement as attachement" +
        " FROM publications INNER JOIN users ON users.id = publications.author_id ORDER BY publications.id DESC", {
        type: QueryTypes.SELECT
    })
        .then(publications => { res.status(200).json(publications); })
        .catch(error => res.status(500).json({ error }));
}

/* RECUPERER UNE PUBLICATION A PARTIR DE L'ID */
exports.getPublicationByID = (req, res, next) => {
    sequelize.query("SELECT users.id as author_id, users.nom as nom, users.prenom as prenom, users.avatarURL as avatar, publications.content as content, publications.attachement as attachement" +
        " FROM publications INNER JOIN users ON users.id = publications.author_id WHERE publications.id = ? ORDER BY publications.id DESC",
        {
            plain: true,
            replacements: [req.params.id],
            type: QueryTypes.SELECT
        })
        .then(publication => { res.status(200).json(publication); })
        .catch(error => res.status(500).json({ error }));
}

/* RECUPERER LES UTILISATEURS QUI ONT AIME LA PUBLICATION */
exports.getLikesOnPublication = (req, res, next) => {
    sequelize.query("SELECT user_id FROM like_publications WHERE publication_id = ?",
        {
            replacements: [req.params.id],
            type: QueryTypes.SELECT
        })
        .then(likes => { res.status(200).json(likes); })
        .catch(error => res.status(500).json({ error }));
}

/* RECUPERER LES PUBLICATIONS D'UN UTILISATEUR */
exports.getPublicationsFromUser = (req, res, next) => {
    sequelize.query("SELECT users.id as author_id, users.nom as nom, users.prenom as prenom, users.avatarURL as avatar, publications.content as content, publications.attachement as attachement, publications.id as publication_id" +
        " FROM publications INNER JOIN users ON users.id = publications.author_id WHERE publications.author_id = ? ORDER BY publications.id DESC",
        {
            replacements: [req.params.user_id],
            type: QueryTypes.SELECT
        })
        .then(publication => { res.status(200).json(publication); })
        .catch(error => res.status(500).json({ error }));
};

/* SUPPRIMER UNE PUBLICATION */
exports.deletePublications = (req, res, next) => {
    Publication.findOne({ where: { id: req.params.id } })
        .then(publication => {
            //SUPPRESSION DE LA PUBLICATION
            publication.destroy()
                .then(() => res.status(200).json({ message: "Publications supprimé avec succés !" }))
                .catch(error => res.status(500).json({ error }));

        }).catch(error => res.status(500).json({ error }));
}

/* AIMER OU NE PLUS AIMER UNE PUBLICATION */
exports.likePublication = (req, res, next) => {
    Likes.findOne({ where:{ user_id: req.body.user_id, publication_id: req.params.id } })
        .then(like => {
            if(!like){ // L'utilisateur n'aime pas la publication, on ajoute le like
                Likes.create({
                    user_id: req.body.user_id,
                    publication_id: req.params.id,
                })
                    .then(() => res.status(201).json({
                        message: "Vous aimez désormais cette publication.",
                        like: 1,
                    }))
                    .catch(error => res.status(400).json({ error }));
            }else{ // L'utilisateur aime déjà la publication, on supprime le like
                like.destroy().then(() => res.status(200).json({
                    message: "Vous n'avez plus cette publication.",
                    like: 0
                }))
                    .catch(error => res.status(500).json({ error }));
            }
        }).catch(error => res.status(500).json({ error }));
}

/* Ajouter une publication */
exports.createPublication = (req, res, next) => {
    let fileUrl = null;
    if(req.file){ //Aucun fichier n'est renseigné
        fileUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`; //ROUTE DE L'IMAGE
    }
    //CREATION DE LA PUBLICATION
    Publication.create({
        author_id: userUtil.getUserID(req),
        content: req.body.message,
        attachement: fileUrl
    })
        .then(() => res.status(201).json({ message: "Votre publication a bien été crée. "}))
        .catch(error => res.status(500).json({ error }));
}
