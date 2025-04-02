import express from 'express';
import UserModel from '../models/userModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    console.log("Received request:", req.body); // Log incoming request
  
    const { userId, query } = req.body;
  
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        console.log("User not found");
        return res.status(404).json({ message: "User not found" });
      }
  
      user.searchHistory.push({ query });
      await user.save();
  
      res.status(200).json({ message: "Search history updated successfully" });
    } catch (error) {
      console.error("Error tracking search:", error);
      res.status(500).json({ message: "Error tracking search", error });
    }
  });

export default router;
