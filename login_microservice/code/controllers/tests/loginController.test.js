import { loginController } from "../loginController.js";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";


jest.mock('lowdb', () => ({
  Low: jest.fn().mockImplementation(() => ({
    read: jest.fn(),
    data: { users: [{ 
      email: 'test@example.com',
      password: 'password123', 
      id: 1, 
      name: 'Test User', 
      completedQuestionnaire: false }] },
  })),
}));

jest.mock('lowdb/node', () => ({
  JSONFile: jest.fn(),
}));

describe('loginController', () => {
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if email or password is missing', async () => {
    req.body = { email: '', password: '' };
    await loginController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Email and password are required.');
  });

  it('should return 401 for invalid credentials', async () => {
    req.body = { email: 'wrong@example.com', password: 'wrongpassword' };
    await loginController(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Invalid email or password.');
  });

  it('should return 200 and user data for valid credentials', async () => {
    req.body = { email: 'test@example.com', password: 'password123' };
    await loginController(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        completedQuestionnaire: false,
      },
    });
  });
});
