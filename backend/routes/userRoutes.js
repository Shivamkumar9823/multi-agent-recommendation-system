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

    
    console.log("New User ID:", newUser._id);

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: newUser._id // Send user ID in the response
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const userId = req.headers.userid; // Read userId from request headers

    if (!userId) {
      return res.status(400).json({ message: "User ID is required in headers" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

export default router;
