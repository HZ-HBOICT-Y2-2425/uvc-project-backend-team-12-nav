// start.js in bank service
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
    balances: [
      {
        id: 1,
        amount: 1000
      },
      {
        id: 2,
        amount: 50
      },
      {
        id: 3,
        amount: 100
      }
    ],
    transactions: []
  };
  
  db = new Low(adapter, defaultData);
  await db.read();

  // This is important: we're explicitly setting db.data if it's null
  if (!db.data) {
    db.data = defaultData;
    await db.write();
  }

  // Change this line - we want to use bankRouter for all /bank routes
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