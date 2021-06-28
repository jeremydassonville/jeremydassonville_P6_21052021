const multer = require('multer');

const MIME_TYPES = { // dictionnaire de type MIME pour définir le format des images
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
}

const storage = multer.diskStorage({ // création d'une constante 'storage' qui est passé à multer comme configuration qui contient la logique pour indiquer à multer où enregister les fichiers entrants
    destination: (req, file, callback) => {
        callback(null, 'images') // indique à multer d'enregistrer les fichiers dans le dossier 'images'
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    } // on indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timstamp comme nom de fichier. La fonction utilise ensuite la constante dictionnaire
      // de type MIME pour résoudre l'extension de fichier appropriée
});

module.exports = multer({ storage }).single('image');