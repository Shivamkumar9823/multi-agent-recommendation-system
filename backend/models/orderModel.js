import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
