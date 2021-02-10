const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const config = require("./config");

const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
const publicationsRoute = require("./routes/publications");
const commentaireRoute = require("./routes/commentaire");

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//RATE LIMITER
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 500
});
app.use(limiter);

// BODY-PARSER
app.use(bodyParser.json());

//HELMET
app.use(helmet());

// Accès au répertoire images
app.use("/images", express.static(path.join(__dirname, config.IMAGES_DIR())));

//Routes d'authentification
app.use("/auth", authRoute);

//Routes de profile
app.use("/profile", profileRoute);

//Routes des publications
app.use("/publications", publicationsRoute);

//Routes des commentaires
app.use("/commentaire", commentaireRoute);

module.exports = app;
