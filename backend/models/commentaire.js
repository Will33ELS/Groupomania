const Sequelize = require('sequelize');
const database = require("../database");

// Table Publications
const Commentaire = database.define("commentaire", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        publication_id: { type: Sequelize.INTEGER, allowNull: false },
        author_id: { type: Sequelize.INTEGER, allowNull: false },
        content: { type: Sequelize.TEXT, allowNull: false },
        date: { type: Sequelize.DATE},
    },
    {
        timestamps: false,
    })

module.exports = Commentaire;
