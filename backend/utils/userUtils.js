const jwt = require("jsonwebtoken");
const sequelize = require("../database");
const { QueryTypes } = require('sequelize');
const config = require("../config");

//Récupérer l'UserID à partir de la clé d'authentification
exports.getUserID = (req) => {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, config.SECRET_KEY());
    const userId = decodedToken.userId;
    return userId;
}

//Vérifié si un utilisateur est administrateur
exports.isAdmin = async (userId) => {
    let admin = await sequelize.query("SELECT isAdmin FROM users WHERE id = ?",
        {
            plain: true,
            replacements: [userId],
            type: QueryTypes.SELECT
        }
    ).then(user => {
        if (user.isAdmin === 1)
            return true;
        return false
    });
    return admin;
}
