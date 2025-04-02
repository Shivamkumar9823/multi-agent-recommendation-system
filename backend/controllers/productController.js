import Product from '../models/productModel.js';
import UserModel from '../models/userModel.js';

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().limit(100); // Fetch only 100 products
    console.log(products);
    res.json(products); // Send product data as a response
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};


// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ Product_ID: req.params.id });
    
    if (product) {
      // Add to browsing history if user is logged in
      if (req.user) {
        await UserModel.findByIdAndUpdate(
          req.user._id,
          { $push: { BrowsingHistory: product.Category } }
        );
      }
      
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trending products
export const getTrendingProducts = async (req, res) => {
  try {
    // Get products with high rating and sorted by createdAt
    const trendingProducts = await Product.find({ Product_Rating: { $gte: 4 } })
      .sort({ createdAt: -1, Product_Rating: -1 })
      .limit(10);
    
    res.json(trendingProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get recommended products
export const getRecommendedProducts = async (req, res) => {
  try {
    if (!req.user) {
      // If no user, return random high-rated products
      const products = await Product.find({ Product_Rating: { $gte: 4 } })
        .sort({ Probability_of_Recommendation: -1 })
        .limit(10);
      
      return res.json(products);
    }
    
    const user = await UserModel.findById(req.user._id);
    
    // Get browsing history categories
    const categories = user.BrowsingHistory;
    
    // Get recommended products based on browsing history
    let recommendedProducts = [];
    
    if (categories.length > 0) {
      // Find products in the same categories from browsing history
      recommendedProducts = await Product.find({
        Category: { $in: categories },
        Probability_of_Recommendation: { $gte: 0.7 }
      }).limit(10);
    }
    
    // If not enough recommendations, add some trending products
    if (recommendedProducts.length < 10) {
      const additional = await Product.find({
        Product_Rating: { $gte: 4 },
        Product_ID: { $nin: recommendedProducts.map(p => p.Product_ID) }
      })
        .sort({ Probability_of_Recommendation: -1 })
        .limit(10 - recommendedProducts.length);
      
      recommendedProducts = [...recommendedProducts, ...additional];
    }
    
    res.json(recommendedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};