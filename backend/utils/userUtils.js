const jwt = require("jsonwebtoken");

//Récupérer l'UserID à partir de la clé d'authentification
exports.getUserID = (req) => {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.userId;
    return userId;
}
