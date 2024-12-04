// start.js

import express from 'express';
import cors from 'cors';
import waterUsageRouter from './routes/waterUsageRouter.js';

async function createServer() {
  const app = express();

  // Add CORS middleware
  app.use(cors());

  app.use(express.json());

  // Use water usage router for /api/water-usage routes
  app.use('/api/water-usage', waterUsageRouter);

  // Basic route for root path
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Water Usage Microservice!' });
  });

  const PORT = process.env.PORT || 3011;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Start the server
createServer().catch((error) => {
  console.error('Error starting the server:', error);
});
