const express = require('express');
const router = express.Router();
const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

var upload = multer({storage: storage});

const importCSV = require('../controllers/importCVS');


// router.post('/', upload.single('file'), function(req, res) {
//     importAuthorCVS.importAuthorCVS;
// });
router.post('/import-author', upload.single('file'), importCSV.importAuthorCVS);
router.post('/import-genre', upload.single('file'), importCSV.importGenreCVS);
router.post('/import-rating', upload.single('file'), importCSV.importRatingCVS);

module.exports = router;