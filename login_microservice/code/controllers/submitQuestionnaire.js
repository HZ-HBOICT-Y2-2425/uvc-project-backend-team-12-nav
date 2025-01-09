// controllers/submitQuestionnaire.js
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export async function submitQuestionnaire(req, res) {
    console.log('Received questionnaire submission request');
    console.log('Request body:', req.body);

    // Pull userId from the request body
    const {
        userId,
        showerTimes,
        showerDuration,
        toiletFlushes,
        laundryLoads,
        newClothesFrequency,
        recycledClothes,
        meatConsumption,
        waterUsage
    } = req.body;

    try {
        // Initialize database
        const adapter = new JSONFile('db.json');
        const db = new Low(adapter, { users: [] });

        // Read existing data
        await db.read();
        console.log('Current database content:', db.data);

        // Convert userId to a number just in case
        const userIndex = db.data.users.findIndex(user => user.id === Number(userId));
        console.log('Found user at index:', userIndex);

        if (userIndex === -1) {
            console.log('User not found with ID:', userId);
            return res.status(404).json({ message: 'User not found.' });
        }

        // Create questionnaire object
        const questionnaire = {
            showerTimes,
            showerDuration,
            toiletFlushes,
            laundryLoads,
            newClothesFrequency,
            recycledClothes,
            meatConsumption,
            waterUsage,
            submittedAt: new Date().toISOString()
        };

        // Update user object
        db.data.users[userIndex] = {
            ...db.data.users[userIndex],
            completedQuestionnaire: true,
            questionnaire,
            total: waterUsage
        };

        console.log('Updated user data:', db.data.users[userIndex]);

        // Write data to the DB
        await db.write();
        console.log('Successfully saved to database');

        // Verification read
        await db.read();
        console.log('Verification - user after save:', db.data.users[userIndex]);

        return res.status(201).json({
            message: 'Questionnaire submitted successfully.',
            questionnaire,
            total: waterUsage
        });
    } catch (error) {
        console.error('Error in submitQuestionnaire:', error);
        return res.status(500).json({
            message: 'Internal server error.',
            error: error.message
        });
    }
}
