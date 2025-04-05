import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  productIds: [
    {
      type: String,
      required: true,
    },
  ],
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
export default Recommendation;
