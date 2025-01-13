// start.js
import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import loggerMiddleware from './middleware/loggerMiddleware.js';
import bankRouter from './routes/bankRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

async function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(loggerMiddleware);

  const adapter = new JSONFile('db.json');
  const defaultData = { 
    balances: [],  // Start with empty balances
    transactions: []
  };
  
  db = new Low(adapter, defaultData);
  await db.read();

  // Initialize db if empty
  if (!db.data) {
    db.data = defaultData;
    await db.write();
  }

  // Make sure required arrays exist
  if (!db.data.balances) db.data.balances = [];
  if (!db.data.transactions) db.data.transactions = [];

  app.use('/bank', bankRouter);

  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Bank Microservice!' });
  });

  const PORT = process.env.PORT || 3020;
  app.listen(PORT, () => {
    console.log(`Bank service running on port ${PORT}`);
  });
}

createServer().catch((error) => {
  console.error('Failed to start server:', error);
});

export { db };