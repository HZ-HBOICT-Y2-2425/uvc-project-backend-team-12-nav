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

// Mapping of washing machine brands to their water consumption per load (in liters)
const washingMachineWaterUsage = {
  'Whirlpool': 50,
  'Samsung': 45,
  'LG': 40,
  'Bosch': 35,
  'GE Appliances': 55,
  'Maytag': 60,
  'Electrolux': 42,
  'Siemens': 38,
  'Haier': 48,
  'Miele': 32,
};

// Function to get water usage per load based on the brand
function getWashingMachineWaterUsage(brand) {
  if (washingMachineWaterUsage.hasOwnProperty(brand)) {
    return washingMachineWaterUsage[brand];
  } else {
    throw new Error(`Unrecognized washing machine brand: ${brand}`);
  }
}

// Function to calculate water usage based on type and value
const calculateWaterUsage = (type, value, brand = null) => {
  switch (type) {
    case 'shower':
      return value * 9; // Liters per minute
    case 'sink':
      return value * 6; // Liters per minute
    case 'toilet':
      return value * 6; // Liters per flush
    case 'washing':
      if (!brand) {
        throw new Error('Brand is required for washing usage');
      }
      const waterPerLoad = getWashingMachineWaterUsage(brand);
      console.log(`Calculating water usage for washing. Brand: ${brand}, Water per load: ${waterPerLoad}, Loads: ${value}`);
      return value * waterPerLoad; // 'value' is the number of loads
    case 'other':
      return value; // For 'other', the calculation is handled separately
    default:
      return 0;
  }
};

// Function to log water usage for shower, sink, toilet, washing
const logWaterUsage = async (req, res, type, valueKey) => {
  try {
    await initDB();

    console.log('Received request body:', req.body); // Debug log

    const { userId, brand } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const value = req.body[valueKey];
    if (value === undefined || value === null || value <= 0) {
      return res.status(400).json({ message: `Invalid ${valueKey}` });
    }

    // Ensure brand is provided for washing
    if (type === 'washing' && !brand) {
      return res.status(400).json({ message: 'Brand is required for washing usage' });
    }

    // For types other than 'washing', ignore the brand
    const effectiveBrand = type === 'washing' ? brand : null;

    const waterUsed = calculateWaterUsage(type, value, effectiveBrand);
    const logEntry = {
      type,
      date: new Date().toISOString(),
      [valueKey]: value,
      waterUsed,
    };

    if (effectiveBrand) {
      logEntry.brand = effectiveBrand; // Include the brand in the log entry
    }

    console.log('Log entry to be saved:', logEntry); // Debug log

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
    console.error(`Error logging ${type} usage:`, error.message);
    if (error.message.startsWith('Unrecognized washing machine brand')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
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

// Define water usage rates for 'other' category
const WATER_USAGE_RATES_OTHER = {
  Cooking: 0.5,    // liters per 500ml cup
  Cleaning: 5,     // liters per 5L bucket
  Gardening: 0.1,  // liters per second
  Drinking: 1,     // liters per liter consumed
};

// Function to log 'other' water usage with categories
export const logOtherUsage = async (req, res) => {
  try {
    await initDB();

    console.log('Received request body:', req.body); // Debug log

    const { userId, category } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!category) {
      return res.status(400).json({ message: 'Category is required for other usage' });
    }

    const allowedCategories = ["Cooking", "Cleaning", "Gardening", "Drinking"];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: `Invalid category. Allowed categories: ${allowedCategories.join(", ")}` });
    }

    let value;
    let waterUsed = 0;

    switch (category) {
      case "Cooking":
        value = req.body.cups;
        if (value === undefined || value === null || value < 0) {
          return res.status(400).json({ message: 'Invalid cups value' });
        }
        waterUsed = value * WATER_USAGE_RATES_OTHER.Cooking;
        break;
      case "Cleaning":
        value = req.body.buckets;
        if (value === undefined || value === null || value < 0) {
          return res.status(400).json({ message: 'Invalid buckets value' });
        }
        waterUsed = value * WATER_USAGE_RATES_OTHER.Cleaning;
        break;
      case "Gardening":
        value = req.body.time;
        if (value === undefined || value === null || value < 0) {
          return res.status(400).json({ message: 'Invalid time value' });
        }
        waterUsed = value * WATER_USAGE_RATES_OTHER.Gardening;
        break;
      case "Drinking":
        value = req.body.liters;
        if (value === undefined || value === null || value < 0) {
          return res.status(400).json({ message: 'Invalid liters value' });
        }
        waterUsed = value * WATER_USAGE_RATES_OTHER.Drinking;
        break;
      default:
        return res.status(400).json({ message: 'Invalid category' });
    }

    const logEntry = {
      type: 'other',
      category,
      date: new Date().toISOString(),
      waterUsed,
    };

    // Include the specific value
    switch (category) {
      case "Cooking":
        logEntry.cups = value;
        break;
      case "Cleaning":
        logEntry.buckets = value;
        break;
      case "Gardening":
        logEntry.time = value;
        break;
      case "Drinking":
        logEntry.liters = value;
        break;
    }

    console.log('Log entry to be saved:', logEntry); // Debug log

    // Ensure user's log array exists
    if (!db.data.waterLogs[userId]) {
      db.data.waterLogs[userId] = [];
    }

    // Add the new log entry
    db.data.waterLogs[userId].push(logEntry);
    await db.write();

    res.json({
      message: `${category} usage logged`,
      data: logEntry,
    });

  } catch (error) {
    console.error(`Error logging other usage:`, error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
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
      bottleEquivalentsToday: waterUsageToday / 5, // Assuming 2 liters per bottle
      bottleEquivalentsYesterday: waterUsageYesterday / 5,
    });
  } catch (error) {
    console.error('Error retrieving shower usage stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

function getStartOfWeek() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0); // Reset time to midnight
  return startOfWeek.toISOString();
}


// Function to calculate total water usage for a user
export const getTotalWaterUsage = async (req, res) => {
  try {
    await initDB();
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const userLogs = db.data.waterLogs[userId] || [];
    const currentWeek = getStartOfWeek();

    // Calculate weekly usage
    const currentWeekUsage = userLogs
      .filter(log => log.date >= currentWeek)
      .reduce((sum, log) => sum + log.waterUsed, 0);

    // Compare with last week
    const lastWeek = new Date(currentWeek);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastWeekKey = lastWeek.toISOString().split('T')[0];
    const lastWeekUsage = db.data.weeklyUsage?.[userId]?.[lastWeekKey] || 0;

    // Save current week's usage
    db.data.weeklyUsage ||= {};
    db.data.weeklyUsage[userId] ||= {};
    db.data.weeklyUsage[userId][currentWeek] = currentWeekUsage;
    await db.write();

    // Ensure weeklySaving defaults to 0
    const weeklySaving = Math.max(0, lastWeekUsage - currentWeekUsage) || 0;

    res.json({
      message: 'Total water usage retrieved successfully',
      totalWaterUsed: currentWeekUsage,
      weeklySaving, // Explicitly send 0 if not available
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to get statistics for daily, weekly, and monthly usage
export const getWaterUsageStats = async (req, res) => {
  try {
    await initDB();
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const userLogs = db.data.waterLogs[userId] || [];
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];

    // Group usage into categories: daily, weekly, and monthly
    const stats = {
      dailyUsage: [],
      weeklyUsage: [],
      monthlyUsage: [],
    };

    const dailyMap = {};
    const weeklyMap = {};
    const monthlyMap = {};

    // Start of the current week (Sunday)
    const startOfWeek = getStartOfWeek(today).toISOString();

    userLogs.forEach(log => {
      const logDate = log.date.split('T')[0];
      const logMonth = log.date.slice(0, 7); // "YYYY-MM"

      // Aggregate daily usage
      if (!dailyMap[logDate]) {
        dailyMap[logDate] = { totalUsage: 0, shower: 0, toilet: 0, tap: 0 };
      }
      dailyMap[logDate].totalUsage += log.waterUsed;

      if (log.type === 'shower') dailyMap[logDate].shower += log.waterUsed;
      if (log.type === 'toilet') dailyMap[logDate].toilet += log.waterUsed;
      if (log.type === 'sink') dailyMap[logDate].tap += log.waterUsed;

      // Aggregate weekly usage
      if (log.date >= startOfWeek) {
        const weekKey = startOfWeek.split('T')[0]; // Current week key
        if (!weeklyMap[weekKey]) weeklyMap[weekKey] = { totalUsage: 0 };
        weeklyMap[weekKey].totalUsage += log.waterUsed;
      }

      // Aggregate monthly usage
      if (!monthlyMap[logMonth]) {
        monthlyMap[logMonth] = { totalUsage: 0 };
      }
      monthlyMap[logMonth].totalUsage += log.waterUsed;
    });

    // Convert daily, weekly, and monthly maps to arrays
    stats.dailyUsage = Object.keys(dailyMap).map(date => ({ date, ...dailyMap[date] }));
    stats.weeklyUsage = Object.keys(weeklyMap).map(week => ({ week, ...weeklyMap[week] }));
    stats.monthlyUsage = Object.keys(monthlyMap).map(month => ({ month, ...monthlyMap[month] }));

    res.json({ message: 'Water usage statistics retrieved', stats });
  } catch (error) {
    console.error('Error fetching water usage stats:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to handle stats requests for other types
export const statsNotAvailable = (req, res) => {
  res.status(403).json({ message: 'Statistics are only available for shower usage.' });
};
