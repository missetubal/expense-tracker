import { Request, Response } from 'express';
import { registerUser, loginUser, getUserInfo, uploadImage } from '../auth';
import { User } from '../../models/User';

jest.mock('../../models/User');
jest.mock('../auth', () => ({
  ...jest.requireActual('../auth'),
  generateToken: jest.fn(() => 'mocked-token'),
}));

let req: Partial<Request>;
let res: Partial<Response>;
let json: jest.Mock;
let status: jest.Mock;

describe('Auth Controller', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn(() => ({ json }));
    res = { status };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('registerUser', () => {
    beforeEach(() => {
      req = {
        body: {
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          profileImageUrl: undefined,
        },
      };
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
        password: 'password123',
        profileImageUrl: undefined,
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

      // Mock console.error
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await registerUser(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        message: 'Error registering user',
        error: error,
      });

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });

  describe('loginUser', () => {
    beforeEach(() => {
      req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };
    });

    it('should login a user successfully', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: 'user-id',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        profileImageUrl: undefined,
      });

      (User.schema.methods.comparePassword as jest.Mock).mockResolvedValue(
        true
      );

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

  describe('getUserInfo', () => {
    beforeEach(() => {
      req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };
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

  describe('uploadImage', () => {
    it('should upload an image and return the image URL', async () => {
      const req = {
        file: { filename: 'test-image.jpg' },
        protocol: 'http',
        get: (headerName: string) => {
          if (headerName === 'host') {
            return 'localhost:3000';
          }
          return null;
        },
      };

      await uploadImage(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({
        imageUrl: 'http://localhost:3000/uploads/test-image.jpg',
      });
    });

    it('should return an error if no file is uploaded', async () => {
      const req = {};

      await uploadImage(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'No file uploaded' });
    });
  });
});
