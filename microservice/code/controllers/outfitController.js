// controllers/outfitController.js
import { db } from '../start.js';

export const getAllOutfits = (req, res) => {
  const outfits = db.data.outfits;
  res.json(outfits);
};

export const getOutfitsByPoints = (req, res) => {
  const userPoints = parseInt(req.params.points, 10);
  if (isNaN(userPoints)) {
    return res.status(400).json({ error: 'Invalid points value' });
  }
  const affordableOutfits = db.data.outfits.filter(outfit => outfit.price <= userPoints);
  res.json(affordableOutfits);
};
