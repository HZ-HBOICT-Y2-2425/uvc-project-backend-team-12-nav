// controllers/getCurrentUser.js
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export const getCurrentUser = async (req, res) => {
  try {
    // Initialize lowdb with default data
    const adapter = new JSONFile('db.json');
    const db = new Low(adapter, { users: [] });

    // Read data from JSON file
    await db.read();

    // For testing, return user2 from the database
    const user = db.data.users.find(u => u.id === 2);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password before sending
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });

  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    res.status(500).send("Internal server error.");
  }
};