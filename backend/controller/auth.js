const bcrypt = require("bcrypt");

const User = require("../models/user");

//CREATION DE L'UTILISATEUR
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //HASHAGE DU MOT DE PASSE
        .then(hash => {
            User.create({
                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                password: hash
            })
                .then(() => res.status(201).json({ message: "Compte crée avec succès !" }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
