const express = require('express');
const dashboardRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const { getDashboard, getStreak } = require('../controllers/dashboard');

dashboardRouter.get('/', userMiddleware, getDashboard);
dashboardRouter.get('/streak', userMiddleware, getStreak);

module.exports = dashboardRouter;
