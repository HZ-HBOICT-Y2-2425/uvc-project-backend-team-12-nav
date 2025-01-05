// routes/bankRouter.js
import express from 'express';
import { 
  getBalance, 
  verifyAndDeduct, 
  getTransactions, 
  updateBalance,
  addBalance 
} from '../controllers/bankController.js';

const router = express.Router();

router.get('/balance/:id', getBalance);  // Now will match /bank/balance/:id
router.post('/transaction/:id', verifyAndDeduct);
router.get('/transactions/:id', getTransactions);
router.put('/balance/:id', updateBalance);
router.post('/balance/add/:id', addBalance);

export default router;