import UserModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register User
export const registerUser = async (req, res) => {
  try {
    const { username, password, age, gender, location } = req.body;

    // Check if user exists
    const userExists = await UserModel.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await UserModel.create({
      username,
      password: hashedPassword,
      age,
      gender,
      location
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        age: user.age,
        gender: user.gender,
        location: user.location,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for user
    const user = await UserModel.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        age: user.age,
        gender: user.gender,
        location: user.location,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        age: user.age,
        gender: user.gender,
        location: user.location,
        BrowsingHistory: user.BrowsingHistory,
        purchaseHistory: user.purchaseHistory,
        customerSegment: user.customerSegment,
        AvgOrderValue: user.AvgOrderValue
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};