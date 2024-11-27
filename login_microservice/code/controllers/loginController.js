import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export async function loginController(req, res) {
  const email = req.query.email;
  const password = req.query.password;

  // Validate the incoming data
  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  try {
    // Initialize lowdb with default data
    const adapter = new JSONFile('db.json');
    const defaultData = { users: [] }; // Default data structure
    const db = new Low(adapter, defaultData);

    // Read data from JSON file (db.json)
    await db.read();

    // Access the users array
    const users = db.data.users;

    // Check if the user exists and the password matches
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }

    // Respond with the user details (excluding the password for security)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      completedQuestionnaire: user.completedQuestionnaire,
    };

    res.status(200).send(`Login successful: ${JSON.stringify(userData)}`);
  } catch (error) {
    // Handle any errors (e.g., file reading or parsing issues)
    console.error("Error reading db.json:", error);
    res.status(500).send("Internal server error.");
  }
}
