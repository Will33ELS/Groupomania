const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

//AUTHENTIFICATION DE L'UTILISATEUR
exports.signin = (req, res, next) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if(!user)
            res.status(404).send("Les identifiants sont incorrects.");
        else{
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid)
                        return res.status(401).send("Les identifiants sont incorrects.")

                res.status(200).json({
                    token: jwt.sign(
                        {userId: user.id},
                            process.env.SECRET_KEY, //RECUPERATION DE LA CLE DANS LE FICHIER UTILS.JS
                        {expiresIn: "24h"} //LA CLE N'EST VALIDE QUE 24h
                    )
                });
            }).catch((error) => {
                console.log(error);
                res.status(500).json({ error })
            });
        }
    }).catch(error => res.status(500).json({ error }));
};
