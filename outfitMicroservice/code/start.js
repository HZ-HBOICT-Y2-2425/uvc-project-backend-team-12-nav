// start.js

import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import loggerMiddleware from './middleware/loggerMiddleware.js';
import outfitRouter from './routes/outfitRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Declare db at the top-level scope
let db;

async function createServer() {
  const app = express();

  // Middleware setup
  app.use(cors());
  app.use(express.json());
  app.use(loggerMiddleware);

  // Initialize LowDB with db.json and default data
  const adapter = new JSONFile('db.json');
  const defaultData = { outfits: [] }; // Provide default data
  db = new Low(adapter, defaultData);

  // Read data from JSON file
  await db.read();

  // Ensure db.data is initialized
  db.data = db.data || { outfits: [] };

  // Use the outfit router
  app.use('/api/outfits', outfitRouter);

  // Root route
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Outfits Microservice!' });
  });

  // Start the server
  const PORT = process.env.PORT || 3011;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Call the createServer function
createServer().catch((error) => {
  console.error('Failed to start server:', error);
});

// Export db after it's initialized
export { db };
