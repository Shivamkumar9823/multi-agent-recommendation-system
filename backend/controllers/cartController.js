import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import UserModel from '../models/userModel.js';

// Get user cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name Product_ID Price imageUrl Brand Category'
    });
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Find product
    const product = await Product.findOne({ Product_ID: productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Find user cart
    let cart = await Cart.findOne({ user: req.user._id });
    
    // Create cart if doesn't exist
    if (!cart) {
      cart = await Cart.create({ 
        user: req.user._id,
        items: [{ product: product._id, quantity }]
      });
      
      cart = await cart.populate({
        path: 'items.product',
        select: 'name Product_ID Price imageUrl Brand Category'
      });
      
      return res.status(201).json(cart);
    }
    
    // Check if product already in cart
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === product._id.toString()
    );
    
    if (itemIndex > -1) {
      // Update quantity if product exists
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item if product doesn't exist in cart
      cart.items.push({ product: product._id, quantity });
    }
    
    await cart.save();
    
    // Populate product details
    cart = await cart.populate({
      path: 'items.product',
      select: 'name Product_ID Price imageUrl Brand Category'
    });
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Find user cart
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Find product
    const product = await Product.findOne({ Product_ID: productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Find item index
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === product._id.toString()
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Update quantity or remove if quantity is 0
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    
    await cart.save();
    
    // Populate product details
    cart = await cart.populate({
      path: 'items.product',
      select: 'name Product_ID Price imageUrl Brand Category'
    });
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Find product
    const product = await Product.findOne({ Product_ID: productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Find user cart
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Find item index
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === product._id.toString()
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Remove item
    cart.items.splice(itemIndex, 1);
    
    await cart.save();
    
    // Populate product details
    cart = await cart.populate({
      path: 'items.product',
      select: 'name Product_ID Price imageUrl Brand Category'
    });
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Checkout (buy functionality)
export const checkout = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    // Find user cart
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name Product_ID Price'
    });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Calculate total amount
    let totalAmount = 0;
    const orderItems = cart.items.map(item => {
      const price = item.product.Price;
      totalAmount += price * item.quantity;
      
      return {
        product: item.product._id,
        quantity: item.quantity,
        price
      };
    });
    
    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod
    });
    
    // Update user purchase history and average order value
    const user = await UserModel.findById(req.user._id);
    
    // Add product categories to purchase history
    const productCategories = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.product._id);
        return product.Category;
      })
    );
    
    // Update purchase history
    user.purchaseHistory = [...user.purchaseHistory, ...productCategories];
    
    // Update avg order value
    const totalOrders = user.purchaseHistory.length > 0 ? 
      Math.ceil(user.purchaseHistory.length / productCategories.length) : 1;
      
    user.AvgOrderValue = ((user.AvgOrderValue * (totalOrders - 1)) + totalAmount) / totalOrders;
    
    // Update customer segment based on order count
    if (totalOrders >= 5) {
      user.customerSegment = 'Loyal Customer';
    } else if (totalOrders >= 2) {
      user.customerSegment = 'Return Customer';
    } else {
      user.customerSegment = 'New Customer';
    }
    
    await user.save();
    
    // Clear cart
    cart.items = [];
    await cart.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};