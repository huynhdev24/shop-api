const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratings.controller');

router.get('/', ratingController.getAll);
router.get('/:id', ratingController.getById);
router.post('/', ratingController.create);
router.post('/average-ratings', ratingController.getAverage);

module.exports = router;
