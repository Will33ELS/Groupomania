const jwt = require('jsonwebtoken');
const config = require("../config")

//Vérification de l'authentification
exports.logged = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, config.SECRET_KEY());
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch (e){
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};
