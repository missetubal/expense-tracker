import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import { User } from '../models/User';

export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user: IUser = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id as string),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user', error: err });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user: IUser | null = await User.findOne({ email });
    if (!user || !(await User.schema.methods.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({
      id: user._id,
      token: generateToken(user._id as string),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging user', error: err });
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const user: IUser | null = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error getting user information', error: err });
  }
};

export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${
    req.file.filename
  }`;

  res.status(200).json({ imageUrl });
};
