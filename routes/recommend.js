const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommends.controller');

// router.get('/', ratingController.getAll);
router.get('/:id', recommendController.getById);
router.post('/', recommendController.create);
router.delete('/', recommendController.deleteAll);
// training bag of words
router.get('/', recommendController.trainNLP)
module.exports = router;
