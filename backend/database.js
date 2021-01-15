const sequelize = require("sequelize");
const env = require("dotenv");

//Chargement du fichier .env
env.config();

//Connexion à la base de donnée
const database = new sequelize(process.env.DB_DBNAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_TYPE
});

//Authentification
database.authenticate()
    .then(() => console.log("Connexion à la base de données réussite !"))
    .catch(error => console.warn("Echec lors de la connexion à la base de données:", error));

module.exports = database;
