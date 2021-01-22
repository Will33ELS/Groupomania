const Publication = require("../models/publication");
const Likes = require("../models/likes");
const userUtil = require("../utils/userUtils");

/* RETOURNE LES PUBLICATIONS DANS L'ORDRE DECROISSANT */
exports.getPublications = (req, res, next) => {
    Publication.findAll({
        order: [
            [ 'id', 'DESC']
        ]
    }).then(publications => { res.status(200).json(publications); })
        .catch(error => res.status(500).json({ error }));
}

/* RECUPERER LES PUBLICATIONS D'UN UTILISATEUR */
exports.getPublicationsFromUser = (req, res, next) => {
    Publication.findAll({
        where:{
            author_id: req.params.user_id
        },
        order: [
            ['id', 'DESC']
        ]
    }).then(publications => { res.status(200).json(publications); })
        .catch(error => res.status(500).json({ error }));
};

/* SUPPRIMER UNE PUBLICATION */
exports.deletePublications = (req, res, next) => {
    Publication.findOne({ id: req.params.id })
        .then(publication => {
            //SUPPRESSION DE LA PUBLICATION
            publication.destroy().then(() => res.status(200).json({ message: "Publications supprimé avec succés !" }))
                .catch(error => res.status(500).json({ error }));

        }).catch(error => res.status(500).json({ error }));
}

/* AIMER OU NE PLUS AIMER UNE PUBLICATION */
exports.likePublication = (req, res, next) => {
    Likes.findOne({ user_id: req.body.user_id, publication_id: req.body.publication_id })
        .then(like => {
            if(!like){ // L'utilisateur n'aime pas la publication, on ajoute le like
                Likes.create({
                    user_id: req.body.user_id,
                    publication_id: req.body.publication_id,
                })
                    .then(() => res.status(201).json({ message: "Vous aimez désormais cette publication." }))
                    .catch(error => res.status(400).json({ error }));
            }else{ // L'utilisateur aime déjà la publication, on supprime le like
                like.destroy().then(() => res.status(200).json({ message: "Vous n'avez plus cette publication. "}))
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
