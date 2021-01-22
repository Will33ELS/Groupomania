const User = require("../models/user");
const Op = require('sequelize').Op

const jwt = require('jsonwebtoken');

//Vérification de l'authentification
exports.logged = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};

exports.canDelete = (req, res, next) => {
    try{
        User.findOne({
            [Op.or]: [
                { user_id: req.body.user_id },
                { isAdmin: 1}
            ]
        }).then(user => {
            if(!user)
                throw 'No permission';
            else
                next();
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};
