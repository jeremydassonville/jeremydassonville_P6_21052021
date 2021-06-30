const express = require('express'); // framework basé sur node.js
const cors = require('cors'); // permet d'utiliser les ressoureces par un autre domaine que celui à partir duquel la première ressource à été servie
const bodyParser = require('body-parser'); // permet d'extraire l'objet JSON des requêtes 
const mongoose = require('mongoose'); // permet de se connecter à la base de donée mongoDB
const path = require('path'); // permet de travailler avec les répertoires et chemin de fichier

const helmet = require('helmet'); // permet de protéger l'application de certaines vulnérabilités connues en configurant de manière appropriée des en-têtes HTTP
const session = require('cookie-session'); // permet de sécurisé les cookies notamment en modifiant le nom du cookie de session par défaut
const rateLimit = require('express-rate-limit'); // sécurie les requêtes en limitant le nombre possible de requête à l'API

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


require('dotenv').config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP pour 100 requètes 
});

mongoose.connect(process.env.DB_URI, 
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(limiter);

app.use(cors());

/* app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  }); */

const expiryDate = new Date(Date.now() + 3600000);
app.use(session( {
  name: 'session',
  secret: process.env.SEC_SES,
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'http://localhost:3000',
    expires: expiryDate
  }
}));  

app.use(bodyParser.json());

app.use(helmet());

app.use('/images', express.static(path.join(__dirname, 'images'))); // permet de gérer la ressource image de manière statique. Utilisé pour récupérer les fichiers qui sont dans le repertoires images

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;