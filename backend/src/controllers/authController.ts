import { Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../types';

const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
};

export const register = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return;
  }
  const { name, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ success: false, message: 'Email already registered' });
      return;
    }
    const user = await User.create({ name, email, password, role: role || 'sales' });
    const token = generateToken(user._id.toString(), user.role);
    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const login = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return;
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }
    const token = generateToken(user._id.toString(), user.role);
    res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};