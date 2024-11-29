// routes/outfitRouter.js
import express from 'express';
import { getAllOutfits, getOutfitsByPoints } from '../controllers/outfitController.js';

const router = express.Router();

router.get('/', getAllOutfits);
router.get('/check/:points', getOutfitsByPoints);

export default router;
    