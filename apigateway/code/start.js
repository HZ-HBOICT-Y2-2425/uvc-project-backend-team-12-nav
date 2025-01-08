// start.js
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { router } from './routes/index.js';  // Use named import
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: 'variables.env' });

// Configuration for ES modules dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

// Enable CORS middleware
app.use(cors());

// Support JSON encoded and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the API routes
app.use('/', router);

// For all other requests, serve the frontend index.html (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  
  // Log configured services (if you have them)
  if (router.services) {
    console.log('📡 Configured services:');
    Object.entries(router.services).forEach(([name, config]) => {
      console.log(`   - ${name}: ${config.url}`);
    });
  }
});

// Handle server errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});