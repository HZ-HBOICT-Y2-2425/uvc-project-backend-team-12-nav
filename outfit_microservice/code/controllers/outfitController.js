// controllers/outfitController.js
import { db } from '../start.js';

export const getAllOutfits = (req, res) => {
  const outfits = db.data.outfits;
  res.json(outfits);
};

export const getOutfitById = (req, res) => {
  const id = req.params.id;
  const outfit = db.data.outfits.find(o => o.id === id);
  
  if (!outfit) {
    return res.status(404).json({ error: 'Outfit not found' });
  }

  res.json(outfit);
};

export const purchaseOutfit = async (req, res) => {
  const { userId, outfitId } = req.params;
  
  const outfit = db.data.outfits.find(o => o.id === outfitId);
  if (!outfit) {
    return res.status(404).json({ error: 'Outfit not found' });
  }

  try {
    const response = await fetch(`http://localhost:3020/bank/transaction/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: outfit.price,
        itemId: outfitId
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json(error);
    }

    const transaction = await response.json();
    
    // Add to user's purchased items if you want to track this
    if (!db.data.purchases) {
      db.data.purchases = [];
    }
    
    db.data.purchases.push({
      userId,
      outfitId,
      purchaseDate: new Date().toISOString(),
      transactionId: transaction.transaction.id
    });
    
    await db.write();

    res.json({
      success: true,
      outfit,
      transaction: transaction.transaction
    });

  } catch (error) {
    console.error('Purchase failed:', error);
    res.status(500).json({ error: 'Purchase failed' });
  }
};