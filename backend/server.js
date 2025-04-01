import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Adjust the path if necessary
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';

const app = express();
const port = 3000;





dotenv.config();
connectDB();
// const router = express.Router();

// Middleware to parse JSON
app.use(express.json());
app.use(cors({ 
  origin: 'http://localhost:5174', 
  credentials: true 
}));



app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});