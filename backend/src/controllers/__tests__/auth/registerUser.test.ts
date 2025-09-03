import { Request, Response } from 'express';
import User from '../../../models/User';
import { registerUser } from '../../auth';

// Mock the User model
jest.mock('../../../models/User');

// Mock the generateToken function
jest.mock('../../auth', () => ({
  ...jest.requireActual('../../auth'),
  generateToken: jest.fn(() => 'mocked-token'),
}));

describe('registerUser', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
    };
    json = jest.fn();
    status = jest.fn(() => ({ json }));
    res = { status };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.create as jest.Mock).mockResolvedValue({
      _id: 'user-id',
      fullName: 'Test User',
      email: 'test@example.com',
      // ... other user properties
    });

    await registerUser(req as Request, res as Response);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(User.create).toHaveBeenCalledWith({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      profileImageUrl: undefined,
    });
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      id: 'user-id',
      user: expect.any(Object),
      token: 'mocked-token',
    });
  });

  it('should return 400 if required fields are missing', async () => {
    req.body = {};
    await registerUser(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'All fields are required' });
  });

  it('should return 400 if email is already in use', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      email: 'test@example.com',
    });

    await registerUser(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'Email already in use' });
  });

  it('should return 500 if there is a server error', async () => {
    const error = new Error('Something went wrong');
    (User.findOne as jest.Mock).mockRejectedValue(error);

    await registerUser(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      message: 'Error registering user',
      error: error,
    });
  });
});
