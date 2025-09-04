import { Request, Response } from 'express';
import { User, IUser } from '../../../models/User';
import { loginUser, registerUser } from '../../auth';

// Mock the User model
jest.mock('../../../models/User');

// Mock the generateToken function
jest.mock('../../auth', () => ({
  ...jest.requireActual('../../auth'),
  generateToken: jest.fn(() => 'mocked-token'),
}));

describe('loginUser', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
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

  it('should login a user successfully', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      _id: 'user-id',
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      profileImageUrl: undefined,
    });

    (User.schema.methods.comparePassword as jest.Mock).mockResolvedValue(true);

    await loginUser(req as Request, res as Response);

    expect(User.findOne).toHaveBeenCalledWith({
      email: 'test@example.com',
    });

    expect(status).toHaveBeenCalledWith(200);
  });

  it('should return 400 if required fields are missing', async () => {
    req.body = {};
    await loginUser(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'All fields are required' });
  });

  it('should return 400 if email is not registered', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await loginUser(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('should return 500 if there is a server error', async () => {
    const error = new Error('Something went wrong');
    (User.findOne as jest.Mock).mockRejectedValue(error);

    await loginUser(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      message: 'Error logging user',
      error: error,
    });
  });
});
