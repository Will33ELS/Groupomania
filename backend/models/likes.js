const Sequelize = require('sequelize');
const database = require("../database");

// Table Publications
const Likes = database.define("like_publication", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: { type: Sequelize.INTEGER, allowNull: false },
        publication_id: { type: Sequelize.INTEGER, allowNull: false },
    },
    {
        timestamps: false,
    })

module.exports = Likes;
