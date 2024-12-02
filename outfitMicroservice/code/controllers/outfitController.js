// controllers/outfitController.js
import { db } from '../start.js';

export const getAllOutfits = (req, res) => {
  console.log('Fetching all items from inventory...');
  const outfits = db.data.outfits;
  console.log('Items found:', outfits.map(o => `${o.type}: ${o.name}`).join(', '));
  res.json(outfits);
};

export const getOutfitsByPoints = (req, res) => {
  const userPoints = parseInt(req.params.points, 10);
  if (isNaN(userPoints)) {
    return res.status(400).json({ error: 'Invalid points value' });
  }
  const affordableOutfits = db.data.outfits.filter(outfit => outfit.price <= userPoints);
  console.log('Affordable items:', affordableOutfits.map(o => `${o.type}: ${o.name}`).join(', '));
  res.json(affordableOutfits);
};

export const getOutfitById = (req, res) => {
  const id = req.params.id;
  const outfit = db.data.outfits.find(o => o.id === id);
  
  if (!outfit) {
    console.log(`⚠️ Item not found: ${id}`);
    return res.status(404).json({ error: 'Item not found' });
  }

  console.log(`🎯 Fetching: ${outfit.type} - ${outfit.name} (${outfit.id})`);
  res.json(outfit);
};