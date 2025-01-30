import request from 'supertest';
import express from 'express';
import { loginController } from '../loginController.js';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Express app setup
const app = express();
app.use(express.json());
app.post('/login', loginController);

// Mock database setup
jest.mock('lowdb', () => {
  return {
    Low: class {
      constructor(adapter) {
        this.adapter = adapter;
        this.data = { users: [] };
      }
      async read() {}
      async write() {}
    },
  };
});

// Bypass `jest.mock()` issues by replacing `JSONFile` directly
jest.mock('lowdb/node', () => ({
  JSONFile: jest.fn(),
}));

describe('Login System Test', () => {
  let db;

  beforeAll(async () => {
    db = new Low(new JSONFile('db.json'));
    db.data = {
      users: [
        {
          id: 1,
          name: 'a',
          email: 'a@a.a',
          password: 'a',
          completedQuestionnaire: true,
        },
      ],
    };
    await db.write();
  });

  it('should return 400 if email or password is missing', async () => {
    const res = await request(app).post('/login').send({ email: 'test@example.com' });
    expect(res.status).toBe(400);
    expect(res.text).toBe('Email and password are required.');
  });

  it('should return 401 for invalid credentials', async () => {
    const res = await request(app).post('/login').send({ email: 'wrong@example.com', password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.text).toBe('Invalid email or password.');
  });
});
