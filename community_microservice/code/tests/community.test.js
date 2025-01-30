import request from 'supertest';
import express from 'express';
import { community, addMember, deleteMember, updateMember } from '../controllers/community.js'; // Ensure correct import path
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Express app setup
const app = express();
app.use(express.json());

// Routes setup
app.get('/members', community); 
app.post('/members', addMember); 
app.delete('/members/:id', deleteMember);
app.put('/members/:id', updateMember); 

// Mock database setup
jest.mock('lowdb', () => {
  return {
    Low: class {
      constructor(adapter) {
        this.adapter = adapter;
        this.data = { members: [{ id: 1, name: 'John Doe' }] }; // Initial mock data with a member
      }
      async read() {}
      async write() {}
    },
  };
});

jest.mock('lowdb/node', () => ({
  JSONFile: jest.fn(),
}));

describe('Community Members System Tests', () => {
  let db;

  beforeAll(async () => {
    db = new Low(new JSONFile('db.json'));
    db.data = {
      members: [
        { id: 1, name: 'John Doe' },
      ],
    };
    await db.write();
  });

  it('should return all members', async () => {
    const res = await request(app).get('/members');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 1, name: 'John Doe' },
    ]);
  });

  it('should add a new member and return 201', async () => {
    const res = await request(app).post('/members').send({ name: 'Jane Smith' });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Member added successfully');
    expect(res.body.member).toHaveProperty('id');
    expect(res.body.member).toHaveProperty('name', 'Jane Smith');
  });

  it('should return 400 if name is missing when adding a member', async () => {
    const res = await request(app).post('/members').send({});
    expect(res.status).toBe(400);
    expect(res.text).toBe('Name is required.');
  });

  it('should delete a member and return 200', async () => {
    const res = await request(app).delete('/members/1');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Member deleted successfully');
    expect(res.body.member).toHaveProperty('id', 1);
  });

  it('should return 404 when deleting a non-existing member', async () => {
    const res = await request(app).delete('/members/999');
    expect(res.status).toBe(404);
    expect(res.text).toBe('Member not found.');
  });

  it('should update a member and return 200', async () => {
    const res = await request(app).put('/members/1').send({ name: 'John Updated' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Member updated successfully');
    expect(res.body.member).toHaveProperty('id', 1);
    expect(res.body.member).toHaveProperty('name', 'John Updated');
  });

  it('should return 404 when updating a non-existing member', async () => {
    const res = await request(app).put('/members/999').send({ name: 'Updated Name' });
    expect(res.status).toBe(404);
    expect(res.text).toBe('Member not found.');
  });
});
