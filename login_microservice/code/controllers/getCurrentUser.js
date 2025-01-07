// controllers/getCurrentUser.js
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export const getCurrentUser = async (req, res) => {
  try {
    console.log('getCurrentUser called with:', {
      query: req.query,
      params: req.params,
      headers: req.headers,
      url: req.url
    });

    // Get user ID from query parameter
    const userId = req.query.userId ? parseInt(req.query.userId) : null;
    console.log('Parsed userId:', userId, typeof userId);

    // Initialize lowdb
    const adapter = new JSONFile('db.json');
    const db = new Low(adapter, { users: [] });
    await db.read();
    
    console.log('Database loaded, all users:', db.data.users.map(u => ({ id: u.id, email: u.email })));

    // If no userId provided, check if there's a logged-in user (for future auth implementation)
    if (!userId) {
      console.log('No userId provided in request');
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find user
    const user = db.data.users.find(u => u.id === userId);
    console.log('Found user:', user ? { id: user.id, email: user.email } : null);

    if (!user) {
      return res.status(404).json({ error: 'User not found', searchedId: userId });
    }

    // Return user data without password
    const { password, ...userWithoutPassword } = user;
    console.log('Sending user data:', userWithoutPassword);
    res.json({ user: userWithoutPassword });

  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};