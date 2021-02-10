const sequelize = require("sequelize");
const env = require("dotenv");

const config = require("./config");

//Chargement du fichier .env
env.config();

//Connexion à la base de donnée
const database = new sequelize(config.DB_DBNAME(), config.DB_USERNAME(), config.DB_PASSWORD(), {
    host: config.DB_HOST(),
    port: config.DB_PORT(),
    dialect: config.DB_TYPE()
});

//Authentification
database.authenticate()
    .then(() => console.log("Connexion à la base de données réussite !"))
    .catch(error => console.warn("Echec lors de la connexion à la base de données:", error));

module.exports = database;
