// controllers/bankController.js
import { db } from '../start.js';

export const getBalance = async (req, res) => {
 console.log('Request received for balance. Full request params:', req.params);
 console.log('Request path:', req.path);
 
 const id = parseInt(req.params.id);
 console.log('Parsed ID:', id, typeof id);
 
 console.log('Current balances in DB:', db.data.balances);
 
 const userBalance = db.data.balances.find(b => {
   console.log('Comparing balance:', b.id, id, b.id === id);
   return b.id === id;
 });
 
 if (!userBalance) {
   console.log('No balance found for ID:', id);
   return res.status(404).json({ 
     error: 'User not found',
     id 
   });
 }

 console.log('Found balance:', userBalance);
 res.json(userBalance);
};

export const verifyAndDeduct = async (req, res) => {
 console.log('Deduction request received:', req.params, req.body);
 const id = parseInt(req.params.id);
 const { amount, itemId } = req.body;

 const userBalance = db.data.balances.find(b => b.id === id);
 
 if (!userBalance) {
   console.log('User not found for deduction:', id);
   return res.status(404).json({ error: 'User not found' });
 }

 if (userBalance.amount < amount) {
   console.log('Insufficient funds:', userBalance.amount, '<', amount);
   return res.status(400).json({ error: 'Insufficient funds' });
 }

 // Deduct amount
 userBalance.amount -= amount;

 // Record transaction
 const transaction = {
   id: `tr_${Date.now()}`,
   userId: id,
   itemId,
   amount,
   type: 'purchase',
   timestamp: new Date().toISOString(),
   balanceAfter: userBalance.amount
 };

 db.data.transactions.push(transaction);
 await db.write();

 console.log(`Purchase successful: User ${id} spent ${amount} on item ${itemId}. New balance: ${userBalance.amount}`);
 return res.json({ 
   success: true, 
   newBalance: userBalance.amount,
   transaction
 });
};

export const getTransactions = (req, res) => {
 console.log('Fetching transactions for:', req.params);
 const id = parseInt(req.params.id);
 const transactions = db.data.transactions.filter(t => t.userId === id);
 console.log('Found transactions:', transactions.length);
 res.json(transactions);
};

export const updateBalance = async (req, res) => {
 console.log('Update balance request:', req.params, req.body);
 const id = parseInt(req.params.id);
 const { amount } = req.body;

 if (typeof amount !== 'number') {
   console.log('Invalid amount type:', typeof amount);
   return res.status(400).json({ error: 'Invalid amount' });
 }

 const userBalance = db.data.balances.find(b => b.id === id);
 
 if (!userBalance) {
   console.log('User not found for balance update:', id);
   return res.status(404).json({ error: 'User not found' });
 }

 userBalance.amount = amount;
 
 // Record transaction
 const transaction = {
   id: `tr_${Date.now()}`,
   userId: id,
   amount,
   type: 'balance_update',
   timestamp: new Date().toISOString(),
   balanceAfter: amount
 };

 db.data.transactions.push(transaction);
 await db.write();

 console.log(`Balance updated for user ${id}: ${amount}`);
 res.json({ 
   success: true,
   newBalance: amount,
   transaction
 });
};

export const addBalance = async (req, res) => {
 console.log('Add balance request:', req.params, req.body);
 const id = parseInt(req.params.id);
 const { amount } = req.body;

 if (typeof amount !== 'number' || amount <= 0) {
   console.log('Invalid amount:', amount);
   return res.status(400).json({ error: 'Invalid amount' });
 }

 const userBalance = db.data.balances.find(b => b.id === id);
 
 if (!userBalance) {
   console.log('User not found for balance addition:', id);
   return res.status(404).json({ error: 'User not found' });
 }

 userBalance.amount += amount;

 // Record transaction
 const transaction = {
   id: `tr_${Date.now()}`,
   userId: id,
   amount,
   type: 'balance_add',
   timestamp: new Date().toISOString(),
   balanceAfter: userBalance.amount
 };

 db.data.transactions.push(transaction);
 await db.write();

 console.log(`Added ${amount} to balance for user ${id}. New balance: ${userBalance.amount}`);
 res.json({ 
   success: true,
   newBalance: userBalance.amount,
   transaction
 });
};