const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

router.get('/revenue/all', analyticsController.getTotalRevenue);
router.get('/revenue/week', analyticsController.getRevenueWeek);
router.get('/revenue/lifetime', analyticsController.getRevenueLifeTime);
router.get('/countorder/lifetime', analyticsController.getCountOrderLifeTime);
router.get('/product/bestseller', analyticsController.getBestSeller);

module.exports = router;
