import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  Product_ID: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },

  Category: { type: String, required: true, trim: true },
  Subcategory: { type: String, trim: true },
  Brand: { type: String, required: true, trim: true },
  
  Price: { type: Number, required: true },
  Product_Rating: { type: Number, min: 0, max: 5 },
  Average_Rating_of_Similar_Products: { type: Number, min: 0, max: 5 },
  Customer_Review_Sentiment_Score: { type: Number, min: 0, max: 1 },

  Holiday: { type: String, enum: ["Yes", "No"], required: true },
  Season: { type: String, trim: true },
  Geographical_Location: { type: String, trim: true },
  
  Similar_Product_List: { type: [String], default: [] }, 
  Probability_of_Recommendation: { type: Number, min: 0, max: 1 },
  
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
