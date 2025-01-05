// controllers/bankController.js
import { db } from '../start.js';

export const getBalance = async (req, res) => {
  const userId = req.params.userId;
  const userBalance = db.data.balances.find(b => b.userId === userId);
  
  if (!userBalance) {
    // If user doesn't exist in db, return error
    return res.status(404).json({ 
      error: 'User not found',
      userId 
    });
  }

  console.log(`Balance fetched for user ${userId}: ${userBalance.amount}`);
  res.json(userBalance);
};

export const verifyAndDeduct = async (req, res) => {
  const userId = req.params.userId;
  const { amount, itemId } = req.body;

  const userBalance = db.data.balances.find(b => b.userId === userId);
  
  if (!userBalance) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (userBalance.amount < amount) {
    return res.status(400).json({ error: 'Insufficient funds' });
  }

  // Deduct amount
  userBalance.amount -= amount;

  // Record transaction
  const transaction = {
    id: `tr_${Date.now()}`,
    userId,
    itemId,
    amount,
    type: 'purchase',
    timestamp: new Date().toISOString(),
    balanceAfter: userBalance.amount
  };

  db.data.transactions.push(transaction);
  await db.write();

  console.log(`Purchase successful: User ${userId} spent ${amount} on item ${itemId}`);
  return res.json({ 
    success: true, 
    newBalance: userBalance.amount,
    transaction
  });
};

export const getTransactions = (req, res) => {
  const userId = req.params.userId;
  const transactions = db.data.transactions.filter(t => t.userId === userId);
  res.json(transactions);
};

export const updateBalance = async (req, res) => {
  const userId = req.params.userId;
  const { amount } = req.body;

  if (typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const userBalance = db.data.balances.find(b => b.userId === userId);
  
  if (!userBalance) {
    return res.status(404).json({ error: 'User not found' });
  }

  userBalance.amount = amount;
  
  // Record balance update transaction
  const transaction = {
    id: `tr_${Date.now()}`,
    userId,
    amount,
    type: 'balance_update',
    timestamp: new Date().toISOString(),
    balanceAfter: amount
  };

  db.data.transactions.push(transaction);
  await db.write();

  console.log(`Balance updated for user ${userId}: ${amount}`);
  res.json({ 
    success: true,
    newBalance: amount,
    transaction
  });
};

export const addBalance = async (req, res) => {
  const userId = req.params.userId;
  const { amount } = req.body;

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const userBalance = db.data.balances.find(b => b.userId === userId);
  
  if (!userBalance) {
    return res.status(404).json({ error: 'User not found' });
  }

  userBalance.amount += amount;

  // Record balance addition transaction
  const transaction = {
    id: `tr_${Date.now()}`,
    userId,
    amount,
    type: 'balance_add',
    timestamp: new Date().toISOString(),
    balanceAfter: userBalance.amount
  };

  db.data.transactions.push(transaction);
  await db.write();

  console.log(`Added ${amount} to balance for user ${userId}. New balance: ${userBalance.amount}`);
  res.json({ 
    success: true,
    newBalance: userBalance.amount,
    transaction
  });
};