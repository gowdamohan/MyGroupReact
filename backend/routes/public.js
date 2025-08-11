const express = require('express');
const router = express.Router();
const { getHomeData } = require('../controllers/homeController');

// Public Home endpoint to serve data for root page
router.get('/home', getHomeData);

module.exports = router;

