
import express from 'express';
<<<<<<< HEAD
import * as dotenv from 'dotenv';
import cors from 'cors'; // Import the cors package

dotenv.config({ path: 'variables.env' });
import indexRouter from './routes/index.js';
=======
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
>>>>>>> feature/waterlogMicroservice

const app = express();
const PORT = process.env.PORT || 80;

<<<<<<< HEAD
// Enable CORS middleware
app.use(cors());

// Support JSON encoded and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the index router
app.use('/', indexRouter);
=======
// Needed to get __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, 'public')));
>>>>>>> feature/waterlogMicroservice

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
