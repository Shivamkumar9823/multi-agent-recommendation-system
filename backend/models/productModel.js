import mongoose from 'mongoose';


// Define a schema for the Product
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Removes whitespace from both ends
  },
  brand: {
    type: String,
    required: true, // New field for brand
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['electronics', 'furniture', 'clothing', 'toys', 'groceries'], // Example categories
    required: true,
  },
  subcategory: {
    type: String,
    required: false, // Optional field for finer classification
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true, // Assuming you store image URLs as a string
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be less than zero'],
  },
  ratings: {
    type: Number,
    min: 0,
    max: 5,
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User collection
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Product model
const productModel = mongoose.model('Product', productSchema);

export default productModel;
