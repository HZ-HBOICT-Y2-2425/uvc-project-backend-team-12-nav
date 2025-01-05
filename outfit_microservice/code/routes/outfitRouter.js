// routes/outfitRouter.js
import express from 'express';
import { getAllOutfits, getOutfitById, purchaseOutfit } from '../controllers/outfitController.js';

const router = express.Router();

router.get('/', getAllOutfits);
router.get('/:id', getOutfitById);
router.post('/purchase/:outfitId/:userId', purchaseOutfit);

export default router;