const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // on recupère le token du header 'Authorization' de la requête entrante
        const decodedToken = jwt.verify(token, process.env.SEC_TOKEN); // on utilise la fonction verify pour décoder le token. si il n'est pas valide une erreur est générée
        const userId = decodedToken.userId; // on récupère l'ID utilisateur du token
        if (req.body.userId && req.body.userId !== userId) { // si la demande contient un ID utilisateur, on le compare à celui extrait du token
            throw 'User ID non valable !'; // si ils sont différents on génére une erreur
        } else {
            next(); // l'utilisateur est authentifié, on passe au middleware suivant
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !'});
    }
};