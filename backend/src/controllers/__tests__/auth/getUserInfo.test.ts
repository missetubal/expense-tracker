import { Request, Response } from 'express';
import { User } from '../../../models/User';
import { getUserInfo } from '../../auth';

// Mock the User model
jest.mock('../../../models/User');

// Mock the generateToken function
jest.mock('../../auth', () => ({
  ...jest.requireActual('../../auth'),
  generateToken: jest.fn(() => 'mocked-token'),
}));

describe('getUserInfo', () => {
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

  it('should find user data and return a user successfully', async () => {
    const req = { user: { id: 'user-id' } };

    (User.findById as jest.Mock).mockResolvedValue({
      _id: 'user-id',
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      profileImageUrl: undefined,
    });

    await getUserInfo(req as Request, res as Response);

    expect(User.findById).toHaveBeenCalledWith('user-id');

    expect(status).toHaveBeenCalledWith(200);

    expect(json).toHaveBeenCalledWith({
      id: 'user-id',
      fullName: 'Test User',
      email: 'test@example.com',
      profileImageUrl: undefined,
    });
  });

  it('should return 404 if required field is missing', async () => {
    req = {};

    (User.findById as jest.Mock).mockResolvedValue(null);

    await getUserInfo(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should return 404 if id is not registered', async () => {
    const req = { user: { id: 'user-id' } };
    (User.findById as jest.Mock).mockResolvedValue(null);

    await getUserInfo(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should return 500 if there is a server error', async () => {
    const error = new Error('Something went wrong');
    (User.findById as jest.Mock).mockRejectedValue(error);

    await getUserInfo(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      message: 'Error getting user information',
      error: error,
    });
  });
});
