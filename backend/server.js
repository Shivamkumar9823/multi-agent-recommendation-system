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
import trackRoute from './routes/trackRoute.js'


const app = express();
const port = 3000;





dotenv.config();
connectDB();
// const router = express.Router();

// Middleware to parse JSON
app.use(express.json());
app.use(cors({ 
  origin: 'http://localhost:5173', 
  credentials: true 
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // Save files to uploads/
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

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
    const products = await Product.find().limit(100); // Fetch only 100 products
    // console.log(products);
    res.json(products); // Send product data as a response
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});


















app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/track-search',trackRoute);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




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