// controllers/signupController.js
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export async function signupController(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("Name, email, and password are required.");
  }

  try {
    console.log('Starting signup process for:', email);
    
    // Initialize lowdb with default data structure
    const adapter = new JSONFile('db.json');
    const db = new Low(adapter, { users: [] });

    // Read existing data
    await db.read();
    console.log('Current database state:', JSON.stringify(db.data, null, 2));

    // Ensure users array exists
    if (!db.data || !db.data.users) {
      db.data = { users: [] };
    }

    // Check if email exists
    const existingUser = db.data.users.find((user) => user.email === email);
    if (existingUser) {
      console.log('Email already exists:', email);
      return res.status(409).send("User with this email already exists.");
    }

    // Find max ID
    const maxId = db.data.users.reduce((max, user) => Math.max(max, user.id), 0);
    const newId = maxId + 1;

    // Create new user
    const newUser = {
      id: newId,
      name,
      email,
      password,
      completedQuestionnaire: false  // Initialize as false
    };

    // Add to database
    db.data.users.push(newUser);
    await db.write();
    
    console.log('Created new user:', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      completedQuestionnaire: newUser.completedQuestionnaire
    });

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword
    });

  } catch (error) {
    console.error("Error in signupController:", error);
    res.status(500).send("Internal server error.");
  }
}