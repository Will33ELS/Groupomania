const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const userUtil = require("../utils/userUtils");
const config = require("../config");

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
        where:{
            email: req.body.email
        }
    }).then(user => {
        if(!user)
            res.status(404).send("Les identifiants sont incorrects.");
        else{
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid)
                        return res.status(401).send("Les identifiants sont incorrects.")

                    const refreshToken = jwt.sign({ userId: user.id }, config.SECRET_KEY(), { expiresIn: 60*3 });
                    const accessToken = jwt.sign({userId: user.id}, config.SECRET_KEY(), {expiresIn: 60*10 });
                    // Définition de la clé d'authentification
                    res.status(200).json({
                        userId: user.id,
                        isAdmin: user.isAdmin,
                        token: accessToken,
                        refreshToken: refreshToken
                    });
                }).catch((error) => {
                    console.log(error);
                res.status(500).json({ error })
            });
        }
    }).catch(error => res.status(500).json({ error }));
};

//RAFRAICHIR LE TOKEN D'ACCES
exports.refreshToken = (req, res, next) => {
    const userID = req.body.userId;
    try{
        const decodedToken = jwt.verify(req.body.refreshToken, config.SECRET_KEY());
        if(req.body.userId === decodedToken.userId){
            const newAccessToken = jwt.sign({userId: userID}, config.SECRET_KEY(), {expiresIn: 60*10})
            const newRefreshToken = jwt.sign({ userId: userID }, config.SECRET_KEY(), { expiresIn: 60*3});
            res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            })
        }else{
            throw 'Invalid user ID'
        }
    }catch (e){
        res.status(401).json({ error: "Authentification incorrect !" })
    }
}

//CHANGEMENT DU MOT DE PASSE
exports.password = (req, res, next) => {
    User.findOne({
        where:{
            id: userUtil.getUserID(req)
        }
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
        where:{
            id: userUtil.getUserID(req)
        }
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
