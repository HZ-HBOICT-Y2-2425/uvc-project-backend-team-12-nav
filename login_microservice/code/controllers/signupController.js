import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
const defaultData = {
  users: [
    {
      id: 1,
      name: "aaa",
      email: "aaa@example.com",
      password: "password",
      completedQuestionnaire: false,
    },
  ],
};
const db = await JSONFilePreset("db.json", defaultData);
const users = db.data.users;

// Controller to handle user signup
export async function signupController(req, res) {
  const { name, email, password } = req.query; // Updated to use req.query

  // Validate the incoming data
  if (!name || !email || !password) {
    return res.status(400).send("Name, email, and password are required.");
  }

  // Check if the email is already in use
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).send("User with this email already exists.");
  }

  // Create the new user object
  const newUser = {
    id: users.length + 1,
    name: name,
    email: email,
    password: password, // In a real app, this should be hashed
    completedQuestionnaire: false,
  };

  // Add the new user to the database
  users.push(newUser);
  await db.write();

  res.status(201).send(`User created successfully: ${JSON.stringify(newUser)}`);
}

