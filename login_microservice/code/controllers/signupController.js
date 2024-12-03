import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export async function signupController(req, res) {
  const { name, email, password } = req.body; // Use req.body for POST data

  // Validate the incoming data
  if (!name || !email || !password) {
    return res.status(400).send("Name, email, and password are required.");
  }

  try {
    // Initialize lowdb with default data
    const adapter = new JSONFile('db.json');
    const db = new Low(adapter, { users: [] });

    // Read data from JSON file (db.json)
    await db.read();

    // Access the users array
    const users = db.data.users;

    // Check if the email is already in use
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(409).send("User with this email already exists.");
    }

    // Create the new user object
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password, // In a real app, hash the password
      completedQuestionnaire: false,
    };

    // Add the new user to the database
    users.push(newUser);
    await db.write();

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error writing to db.json:", error);
    res.status(500).send("Internal server error.");
  }
}
