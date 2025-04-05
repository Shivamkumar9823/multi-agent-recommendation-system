import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Adjust the path if necessary
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import multer from "multer";
import fs from "fs";
import Product from "./models/productModel.js";
import UserModel from "./models/userModel.js";
import cartRoutes from './routes/cartRoutes.js';
import trackRoute from './routes/trackRoute.js';
import bcrypt from 'bcryptjs';
import Recommendation from './models/Recommendation.js';




const app = express();
const port = 3000;





dotenv.config();
connectDB();
// const router = express.Router();

// Middleware to parse JSON
app.use(express.json());
app.use(cors({ 
  origin: ['http://localhost:5173', 'https://aiagentfrontend-steel.vercel.app' ], 
  credentials: true 
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // Save files to uploads/
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });
app.get('/', async (req, res) => {
  try {
    res.status(200).json({ message: "🚀 API is working fine!" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});



app.post("/upload-json", upload.single("file"), async (req, res) => {
  try {
    // Read the uploaded JSON file
    const filePath = req.file.path;
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Parse `Similar_Product_List` field correctly
    jsonData.forEach((product) => {
      if (product.Similar_Product_List) {
        product.Similar_Product_List = JSON.parse(
          product.Similar_Product_List.replace(/'/g, '"')
        );
      }
    });

    // Insert into MongoDB
    await Product.insertMany(jsonData);

    res.status(200).json({ message: "✅ Data uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload data" });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch only 100 products
    // console.log(products);
    res.json(products); // Send product data as a response
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});




app.post('/api/register',  async (req, res) => {
  console.log("Incoming request:", req.body);
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


app.get('/api/profile',  async (req, res) => {
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
})


app.get('/recommendations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const recommendation = await Recommendation.findOne({ userId });

    if (!recommendation) {
      return res.status(404).json({ message: 'No recommendations found for this user.' });
    }

    res.json({ productIds: recommendation.productIds });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/recommendations', async (req, res) => {
  const { userId, productIds } = req.body;

  if (!userId || !productIds || !Array.isArray(productIds)) {
    return res.status(400).json({ message: 'Invalid data. userId and productIds are required.' });
  }

  try {
    const recommendation = await Recommendation.findOneAndUpdate(
      { userId },
      { productIds },
      { new: true, upsert: true } // Create new if doesn't exist
    );

    res.status(200).json({ message: 'Recommendations saved successfully', recommendation });
  } catch (error) {
    console.error('Error saving recommendation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
  










// app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/track-search',trackRoute);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// module.exports = app;



// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import connectDB from './config/db.js';
// import authRoutes from './routes/authRoutes.js';
// import productRoutes from './routes/productRoutes.js';
// import cartRoutes from './routes/cartRoutes.js';

// // Load env vars
// dotenv.config();

// // Connect to database
// connectDB();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);

// // Serve frontend in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('frontend/build'));
  
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
//   });
// }

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });