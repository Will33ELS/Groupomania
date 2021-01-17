const Sequelize = require('sequelize');
const database = require("../database");

// Table Publications
const Commentaire = database.define("commentaire", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        author_id: { type: Sequelize.INTEGER, allowNull: false },
        content: { type: Sequelize.TEXT, allowNull: false },
    },
    {
        timestamps: false,
    })

module.exports = Commentaire;
