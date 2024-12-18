import express from 'express';
import {
  logShowerUsage,
  logSinkUsage,
  logToiletUsage,
  logWashingUsage,
  logOtherUsage,
  getShowerUsageStats,
  getTotalWaterUsage,
  getWaterUsageStats
} from '../controllers/waterUsageController.js';

const router = express.Router();

// Define routes
router.post('/shower', logShowerUsage);
router.post('/sink', logSinkUsage);
router.post('/toilet', logToiletUsage);
router.post('/washing', logWashingUsage);
router.post('/other', logOtherUsage);

// Route to get shower usage statistics
router.get('/shower/stats', getShowerUsageStats);

// Route to get total water usage
router.get('/total', getTotalWaterUsage);
router.get('/stats', getWaterUsageStats);

export default router;
