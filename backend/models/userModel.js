import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: {type: String, required: true},
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  location: { type: String, required: true },
  BrowsingHistory: [
    {
      page: { type: String },
      action: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  searchHistory:  [
    {
      query: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  customerSegment: {type: String, default: 'New Visitor'},
  AvgOrderValue: { type: Number, default: 0 }
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;