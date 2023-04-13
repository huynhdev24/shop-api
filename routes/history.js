const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');

router.get('/', historyController.getAll);
router.get('/:id', historyController.getById);
router.post('/', historyController.create);
router.put('/:id', historyController.updateById);
router.delete('/:id', historyController.deleteById);

module.exports = router;
