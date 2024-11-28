import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import loggerMiddleware from './middleware/loggerMiddleware.js';
import mime from 'mime';
import cors from 'cors';
import outfitRouter from './routes/outfitRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

async function createServer() {
  const app = express();
  
  // Add CORS middleware
  app.use(cors());
  
  app.use(express.json());
  app.use(loggerMiddleware);

  // Define default data structure
  const defaultData = { outfits: [] };

  // Create adapter and initialize db with default data
  const adapter = new JSONFile('db.json');
  db = new Low(adapter, defaultData);

  // Read data from JSON file
  await db.read();

  // Function to read and encode images
  async function loadOutfits() {
    const outfits = [
      {
        id: "hat_1",
        name: "Eco Hat",
        type: "Head",
        price: 50,
        imagePath: path.join(__dirname, "../pics/hat.svg"),
        description: "A stylish eco-friendly hat",
      },
      {
        id: "shirt_1",
        name: "Eco Shirt",
        type: "Shirt",
        price: 70,
        imagePath: path.join(__dirname, "../pics/shirt.svg"),
        description: "A trendy eco-friendly shirt",
      },
    ];

    const validOutfits = [];

    for (const outfit of outfits) {
      try {
        const imageFilePath = path.resolve(outfit.imagePath);
        const imageData = await fs.readFile(imageFilePath);
        const base64Image = imageData.toString('base64');
        const mimeType = mime.getType(imageFilePath);
        outfit.image = `data:${mimeType};base64,${base64Image}`;
        delete outfit.imagePath;
        validOutfits.push(outfit);
      } catch (error) {
        console.warn(`File missing for ${outfit.name}:`, error);
      }
    }

    db.data.outfits = validOutfits;
    await db.write();
  }

  // Load outfits with images into the database
  await loadOutfits();

  // Use outfit router for /api/outfits routes
  app.use('/api/outfits', outfitRouter);

  // Basic route for root path
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Outfits Microservice!' });
  });

  const PORT = process.env.PORT || 3011;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the database for external use
export { db };

// Start the server
createServer().catch((error) => {
  console.error('Error starting the server:', error);
});