const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommends.controller');

// router.get('/', ratingController.getAll);
router.get('/:id', recommendController.getById);
router.post('/', recommendController.create);

module.exports = router;
