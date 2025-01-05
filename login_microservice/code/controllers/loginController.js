// controllers/loginController.js
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export const loginController = async (req, res) => {
    console.log('Request Body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required.");
    }

    try {
      const adapter = new JSONFile('db.json');
      const db = new Low(adapter, { users: [] });

      await db.read();

      const users = db.data.users;

      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (!user) {
        return res.status(401).send("Invalid email or password.");
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        completedQuestionnaire: user.completedQuestionnaire,
      };

      res.status(200).json({
        message: "Login successful",
        user: userData,
      });
    } catch (error) {
      console.error("Error reading db.json:", error);
      res.status(500).send("Internal server error.");
    }
};