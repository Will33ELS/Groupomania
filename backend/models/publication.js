const Sequelize = require('sequelize');
const database = require("../database");

// Table Publications
const Publication = database.define("publications", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        author_id: { type: Sequelize.INTEGER, allowNull: false },
        content: { type: Sequelize.TEXT, allowNull: false },
        attachement: { type: Sequelize.STRING(255), allowNull: true},
        post_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    },
    {
        timestamps: false,
    })

module.exports = Publication;
