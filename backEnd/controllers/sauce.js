const Sauce = require('../models/sauce');
const fs = require('fs'); // on importe le module 'file system' de Node qui permet ici de gérer les téléchargements et modifications d'images

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // on modifie l'url de l'image de manière dynamique car c'est le middleware multer qui à générer le fichier
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauces = (req, res, next) => {
    // on utilise l'opérateur ternaire pour vérifier si l'utilisateur à modifier l'image ou juste les informations de la sauces
   const sauceObject = req.file ?
   {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(500).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // on trouver l'objet dans la base de donnée
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; // on récupère le nom du fichier avec split
            fs.unlink(`images/${filename}`, () => { // on utilise unlink pour supprimer le fichier
               Sauce.deleteOne({ _id: req.params.id }) // on supprimer l'objet de la base de donnée
                .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                .catch(error => res.status(400).json({ error })); 
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.likeDislikeSauce = (req, res, next) => {

    let like = req.body.like;
    let userId = req.body.userId;
    let sauceId = req.params.id;

    if (like === 1) {
        Sauce.updateOne({
            _id: sauceId
        }, {
            $push: {
                usersLiked: userId
            },
            $inc: {
                likes: +1
            },
        })
        .then(() => res.status(200).json({ message: "j'aime ajouté !"}))
        .catch(error => res.status(400).json({ error }));
    }

    if (like === -1) {
        Sauce.updateOne({
            _id: sauceId
        }, {
            $push: {
                usersDisliked: userId
            },
            $inc: {
                dislikes: +1
            },
        })
        .then(() => res.status(200).json({ message: "Dislike ajouté !"}))
        .catch(error => res.status(400).json({ error }));
    }

    if (like === 0){
        Sauce.findOne({
            _id: sauceId
        })
        .then((sauce) => {
            if (sauce.usersLiked.includes(userId)) {
                Sauce.updateOne({
                    _id: sauceId
                }, {
                    $pull: {
                        usersLiked: userId
                    },
                    $inc: {
                        likes: -1
                    },
                })
                .then(() => res.status(200).json({ message: "Like retiré !"}))
                .catch(error => res.status(400).json({ error }));
            }
            if (sauce.usersDisliked.includes(userId)) {
                Sauce.updateOne({
                    _id: sauceId
                }, {
                    $pull: {
                        usersDisliked: userId
                    },
                    $inc: {
                        dislikes: -1
                    },
                })
                .then(() => res.status(200).json({ message: "Dislike retiré !"}))
                .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
    }
}