const express = require('express');
const router = express.Router();
const pythonsController = require('../controllers/pythons.controller');

router.get('/nlp', pythonsController.testPythonShell);

module.exports = router;
