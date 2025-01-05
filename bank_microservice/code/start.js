// start.js (bank service)
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
    balances: [{
      userId: "user1",
      amount: 100
    }],
    transactions: [] 
  };
  db = new Low(adapter, defaultData);

  await db.read();
  db.data = db.data || defaultData;

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
  console.error('Failed to start bank server:', error);
});

export { db };