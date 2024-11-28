// apigateway/start.js

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 80;

// Needed to get __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the routes defined in routes/index.js
app.use('/', routes);

// For all other requests, serve the frontend index.html (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
