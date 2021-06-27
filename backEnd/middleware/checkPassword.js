const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.writeHead(400, '{"Mot de passe requis : 8 caractères minimun. Au moins 1 Majuscule, 1 minuscule, 2 chiffres, sans espaces"}', {
            'content-type': 'application/json'
        });
        res.end('Format de mot de passe incorrect !');
    } else {
        next();
    }
};