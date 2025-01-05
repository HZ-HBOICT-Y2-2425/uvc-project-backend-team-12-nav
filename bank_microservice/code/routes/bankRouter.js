// routes/bankRouter.js
import express from 'express';
import { getBalance, verifyAndDeduct, getTransactions } from '../controllers/bankController.js';

const router = express.Router();

router.get('/balance/:userId', getBalance);
router.post('/transaction/:userId', verifyAndDeduct);
router.get('/transactions/:userId', getTransactions);

export default router;