const Sequelize = require('sequelize');
const database = require("../database");

// Table Users
const User = database.define("users", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        nom: { type: Sequelize.STRING(255), allowNull: false },
        prenom: { type: Sequelize.STRING(255), allowNull: false },
        email: { type: Sequelize.STRING(255), unique: true, allowNull: false },
        avatarURL: { type: Sequelize.STRING, allowNull: true },
        isAdmin: { type: Sequelize.BOOLEAN, default: false },
    },
    {
        timestamps: false,
        tableName: "users",
    });

module.exports = User;

