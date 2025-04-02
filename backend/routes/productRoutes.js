import express from 'express';
import { 
  getProducts, 
  getProductById, 
  getTrendingProducts,
  getRecommendedProducts
} from '../controllers/productController.js';

import { optional } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/trending', getTrendingProducts);
router.get('/recommended', optional, getRecommendedProducts);
router.get('/:id', optional, getProductById);

export default router;