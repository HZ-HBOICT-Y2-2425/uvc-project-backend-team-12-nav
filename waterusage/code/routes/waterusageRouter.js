// routes/waterUsageRouter.js

import express from 'express';
import {
  logShowerUsage,
  logSinkUsage,
  logToiletUsage,
  logWashingUsage,
  logOtherUsage,
  getShowerUsageStats,
} from '../controllers/waterUsageController.js';

const router = express.Router();

// Routes for different water usage types
router.post('/shower', logShowerUsage);
router.post('/sink', logSinkUsage);
router.post('/toilet', logToiletUsage);
router.post('/washing', logWashingUsage);
router.post('/other', logOtherUsage);

// Route to get shower usage statistics
router.get('/shower/stats', getShowerUsageStats);

export default router;
