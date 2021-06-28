const bcrypt = require('bcryptjs'); // hash du mot de passe des utilisateurs
const jwt = require('jsonwebtoken'); // permet d'attribuer un token unique à un utilisateur lors de sa connection

const User = require('../models/user'); // importation du model User créer grave au schéma mongoose

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // on utilise la méthode hash de bcrypt, 10 représente le nombre de tours que va faire l'algorithme
        .then(hash => {
            const user = new User({ // création du nouvel utilisateur dans la base de donnée mongoDB
                email: req.body.email,
                password: hash
            });
            user.save() // on enregistre l'utilisateur crée dans la base de donnée
                .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
                .catch(error => res.status(400).json({ error }));
        })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // on rechercher l'utilisateur dans la base de donnée
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' }); // si l'utilisateur n'est pas trouvé on renvoi une erreur 
        }
        bcrypt.compare(req.body.password, user.password) // on utilise bcrypt pour comparer les hash et vérifier si ils ont la même 'string' d'origine
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' }); // Si false, on renvoi une erreur
                }
                res.status(200).json({ // Si true, on renvoie un objet JSON avec un userID + un token qui permet de vérifier si la requête est authentifiée
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        process.env.SEC_TOKEN,
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};