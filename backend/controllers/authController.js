import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Include all user fields in the JWT so frontend can decode them instantly
const generateToken = (id, name, email, avatar, role) => 
  jwt.sign({ id, name, email, avatar, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  
  res.status(201).json({ 
    _id: user._id, 
    name: user.name, 
    email: user.email, 
    role: user.role, 
    token: generateToken(user._id, user.name, user.email, user.avatar, user.role) 
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (!user.password) {
    return res.status(400).json({ message: 'This account uses Google Sign-In. Please log in with Google.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ 
    _id: user._id, 
    name: user.name, 
    email: user.email, 
    role: user.role, 
    avatar: profile.photos?.[0]?.value,
    token: generateToken(user._id, user.name, user.email, user.avatar, user.role) 
  });
};

export const googleAuth = async (req, res) => {
  const { credential } = req.body;
  const ticket = await client.verifyIdToken({ 
    idToken: credential, 
    audience: process.env.GOOGLE_CLIENT_ID 
  });
  const payload = ticket.getPayload();

  let user = await User.findOne({ email: payload.email });
  
  if (!user) {
    user = await User.create({
      name: payload.name,
      email: payload.email,
      googleId: payload.sub,
      avatar: payload.picture,
    });
  } else if (!user.avatar && payload.picture) {
    // Update existing Google user if avatar is missing
    user.avatar = payload.picture;
    await user.save();
  }

  res.json({ 
    _id: user._id, 
    name: user.name, 
    email: user.email, 
    avatar: user.avatar, 
    role: user.role, 
    token: generateToken(user._id, user.name, user.email, user.avatar, user.role) 
  });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};