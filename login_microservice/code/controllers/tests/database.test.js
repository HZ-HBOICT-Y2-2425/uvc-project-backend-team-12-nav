import fs from 'fs';
import path from 'path';

describe('Database Tests', () => {
  let db;

  beforeAll(async () => {
    const dbPath = path.resolve(__dirname, '../../db.json');
    const rawData = fs.readFileSync(dbPath);
    db = JSON.parse(rawData);
    console.log('Database loaded:', db);
  });

  test('should have a valid "users" array', () => {
    expect(Array.isArray(db.users)).toBe(true);
    expect(db.users.length).toBeGreaterThan(0);
  });

  test('should validate the structure of the first user', () => {
    const user = db.users[0];

    expect(user).toHaveProperty('id', 1);
    expect(user).toHaveProperty('name', 'a');
    expect(user).toHaveProperty('email', 'a@a.a');
    expect(user).toHaveProperty('password', 'a');
    expect(user).toHaveProperty('completedQuestionnaire', true);
    expect(user).toHaveProperty('total', 205);
    expect(user).toHaveProperty('questionnaire');
    
    const questionnaire = user.questionnaire;
    expect(questionnaire).toHaveProperty('showerTimes', '1-3');
    expect(questionnaire).toHaveProperty('showerDuration', '1-5 minutes');
    expect(questionnaire).toHaveProperty('toiletFlushes', '1-3');
    expect(questionnaire).toHaveProperty('laundryLoads', '1-3');
    expect(questionnaire).toHaveProperty('newClothesFrequency', 'Weekly');
    expect(questionnaire).toHaveProperty('recycledClothes', 0);
    expect(questionnaire).toHaveProperty('meatConsumption', 0);
    expect(questionnaire).toHaveProperty('waterUsage', 205);
    expect(questionnaire).toHaveProperty('submittedAt');

    const submittedDate = new Date(questionnaire.submittedAt);
    expect(submittedDate.toISOString()).toBe(questionnaire.submittedAt);
  });

  test('should calculate the correct total water usage', () => {
    const user = db.users[0];
    const expectedTotal = user.questionnaire.waterUsage;

    expect(user.total).toBe(expectedTotal);
  });
});
