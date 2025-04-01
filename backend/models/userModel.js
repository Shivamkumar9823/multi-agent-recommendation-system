import mongoose from 'mongoose';

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password:{type:String,required:true},
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  location: { type: String, required: true },
  BrowsingHistory: { type: [String], default: [] },
  purchaseHistory: { type: Array, default: [] },
  customerSegment : {type:String, default:'New Visitor'},
  AvgOrderValue: { type: Number, default: 0 }
});

// Create User Model
const UserModel = mongoose.model('User', userSchema);

export default UserModel;
