const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const userUtil = require("../utils/userUtils");

//CREATION DE L'UTILISATEUR
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //HASHAGE DU MOT DE PASSE
        .then(hash => {
            //Création du compte dans la base de données
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
                    // Définition de la clé d'authentification
                    res.status(200).json({
                        token: jwt.sign(
                            {userId: user.id},
                            process.env.SECRET_KEY, //RECUPERATION DE LA CLE DANS LE FICHIER UTILS.JS
                            {expiresIn: "24h"} //LA CLE N'EST VALIDE QUE 24h
                        )
                    });
                }).catch((error) => {
                res.status(500).json({ error })
            });
        }
    }).catch(error => res.status(500).json({ error }));
};

//CHANGEMENT DU MOT DE PASSE
exports.password = (req, res, next) => {
    User.findOne({
        id: userUtil.getUserID()
    }).then(user => {
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid) // Vérification du mot de passe actuel
                    return res.status(401).send("Le mot de passe saisie est incorrect.");
                else if(req.body.newpassword !== req.body.confirmpassword) // Vérification des deux mots de passe saisies
                    return res.status(401).send("Les mots de passe ne correspondent pas.");
                else{
                    bcrypt.hash(req.body.newpassword, 10) //HASHAGE DU MOT DE PASSE
                        .then(hash => {
                            //Sauvegarde du nouveau mot de passe
                            user.password = hash;
                            user.save().then(() => res.status(200).json({ message: "Mot de passe changé avec succès !"}))
                                .catch(error => res.status(500).json({ error }));
                        })
                        .catch(error => res.status(500).json({ error }));
                }
            }).catch((error) => {
            res.status(500).json({ error })
        });
    }).catch(error => res.status(500).json({ error }));
};

//SUPPRESSION DU COMPTE
exports.unregister = (req, res, next) => {
    User.findOne({ //Recherche de l'utilisateur
        id: userUtil.getUserID(req)
    }).then(user => {
        //COMPARAISON DES MOTS DE PASSE
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid) // Vérification du mot de passe actuel
                    return res.status(401).send("Le mot de passe saisie est incorrect.");
                else{
                    //Suppression du compte
                    user.destroy().then(() => res.status(200).json({ message: "Compte supprimé avec succés !" }))
                        .catch(error => res.status(500).json({ error }));
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error })
            });

    }).catch(error => res.status(500).json({ error }));
}
