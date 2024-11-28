import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';


// Define default data structure
const defaultData = { waterLogs: {} };

// Initialize the database
const filePath = path.resolve('db.json');
const adapter = new JSONFile(filePath);
const db = new Low(adapter, defaultData);

// Function to initialize the database
async function initDB() {
  await db.read();
  db.data = db.data || defaultData;
}

const calculateWaterUsage = (type, value) => {
  switch (type) {
    case 'shower':
      return value * 9; // Liters per minute
    case 'sink':
      return value * 6; // Liters per minute
    case 'toilet':
      return value * 6; // Liters per flush
    case 'washing':
      return value * 50; // Liters per load
    case 'other':
      return value; // Direct input in liters
    default:
      return 0;
  }
};

const logWaterUsage = async (req, res, type, valueKey) => {
  try {
    await initDB();

    const { userId } = req.body; // Get userId from request body
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const value = req.body[valueKey];
    if (!value || value <= 0) {
      return res.status(400).json({ message: `Invalid ${valueKey}` });
    }

    const waterUsed = calculateWaterUsage(type, value);
    const logEntry = {
      type,
      date: new Date().toISOString(),
      [valueKey]: value,
      waterUsed,
    };

    // Ensure user's log array exists
    if (!db.data.waterLogs[userId]) {
      db.data.waterLogs[userId] = [];
    }

    // Add the new log entry
    db.data.waterLogs[userId].push(logEntry);
    await db.write();

    res.json({
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} usage logged`,
      data: logEntry,
    });
  } catch (error) {
    console.error(`Error logging ${type} usage:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller functions for each water usage type
export const logShowerUsage = async (req, res) => {
  await logWaterUsage(req, res, 'shower', 'duration');
};

export const logSinkUsage = async (req, res) => {
  await logWaterUsage(req, res, 'sink', 'duration');
};

export const logToiletUsage = async (req, res) => {
  await logWaterUsage(req, res, 'toilet', 'flushes');
};

export const logWashingUsage = async (req, res) => {
  await logWaterUsage(req, res, 'washing', 'loads');
};

export const logOtherUsage = async (req, res) => {
  await logWaterUsage(req, res, 'other', 'waterUsed');
};

// Function to get water usage statistics for shower only
export const getShowerUsageStats = async (req, res) => {
  try {
    await initDB();

    const { userId } = req.query; // Get userId from query parameters
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!db.data.waterLogs[userId]) {
      return res.json({
        message: 'No data available for the user',
        waterUsageToday: 0,
        waterUsageYesterday: 0,
        bottleEquivalentsToday: 0,
        bottleEquivalentsYesterday: 0,
      });
    }

    // Filter logs for the user and type 'shower'
    const logs = db.data.waterLogs[userId].filter((log) => log.type === 'shower');

    // Calculate total water used for today and yesterday
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];

    const todayLogs = logs.filter((log) => log.date.startsWith(todayDate));
    const yesterdayLogs = logs.filter((log) => log.date.startsWith(yesterdayDate));

    const waterUsageToday = todayLogs.reduce((sum, log) => sum + log.waterUsed, 0);
    const waterUsageYesterday = yesterdayLogs.reduce((sum, log) => sum + log.waterUsed, 0);

    res.json({
      message: 'Shower usage statistics retrieved',
      waterUsageToday,
      waterUsageYesterday,
      bottleEquivalentsToday: waterUsageToday / 10, // Assuming 2 liters per bottle
      bottleEquivalentsYesterday: waterUsageYesterday / 2,
    });
  } catch (error) {
    console.error('Error retrieving shower usage stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to handle stats requests for other types
export const statsNotAvailable = (req, res) => {
  res.status(403).json({ message: 'Statistics are only available for shower usage.' });
};
