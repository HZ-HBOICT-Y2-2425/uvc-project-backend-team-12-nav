// login_microservice/code/controllers/submitQuestionnaire.js
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export async function submitQuestionnaire(req, res) {
  const { 
    email, 
    showerTimes, 
    showerDuration, 
    toiletFlushes, 
    laundryLoads, 
    newClothesFrequency, 
    recycledClothes, 
    meatConsumption, 
    waterUsage 
  } = req.body;

  // Basic Validation
  if (
    !email ||
    !showerTimes ||
    !showerDuration ||
    !toiletFlushes ||
    !laundryLoads ||
    !newClothesFrequency ||
    recycledClothes === undefined ||
    meatConsumption === undefined ||
    waterUsage === undefined
  ) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Initialize lowdb with default data
    const adapter = new JSONFile('db.json');
    const db = new Low(adapter, { users: [] });

    // Read data from JSON file (db.json)
    await db.read();

    // Ensure default structure
    db.data ||= { users: [] };

    // Find the user by email
    const user = db.data.users.find((user) => user.email === email);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.completedQuestionnaire) {
      return res.status(400).json({ message: 'Questionnaire already submitted.' });
    }

    // Create the questionnaire object
    const questionnaire = {
      showerTimes,
      showerDuration,
      toiletFlushes,
      laundryLoads,
      newClothesFrequency,
      recycledClothes,
      meatConsumption,
      waterUsage,
      submittedAt: new Date().toISOString(),
    };

    // Update the user object
    user.questionnaire = questionnaire;
    user.total = waterUsage; // Store waterUsage as total
    user.completedQuestionnaire = true;

    // Write changes to db.json
    await db.write();

    res.status(201).json({ 
      message: 'Questionnaire submitted successfully.', 
      questionnaire,
      total: waterUsage
    });
  } catch (error) {
    console.error('Error submitting questionnaire:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
