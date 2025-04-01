import express from 'express';
import bcrypt from 'bcryptjs';
import UserModel from '../models/userModel.js';

const router = express.Router();

// Register Endpoint
router.post('/register', async (req, res) => {
  const { username, password, age, gender, location } = req.body;

  try {
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword, age, gender, location });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
});

export default router;
