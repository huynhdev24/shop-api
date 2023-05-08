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

const importCSV = require('../controllers/importAuthorCVS');


// router.post('/', upload.single('file'), function(req, res) {
//     importAuthorCVS.importAuthorCVS;
// });
router.post('/', upload.single('file'), importCSV.importAuthorCVS);

module.exports = router;