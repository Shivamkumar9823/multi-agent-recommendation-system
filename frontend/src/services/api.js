import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users';
const PYTHON_API_URL = 'http://localhost:5001';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.message : error.message;
  }
};

export const getProductRecommendations = async (userdata) => {
    const response = await axios.post(`${PYTHON_API_URL}/recommend-products`, { userdata });
    console.log(response.data);
    return response.data;
  };

//   export const getTrendingRecommendations = async (userId) => {
//     const response = await axios.post(`${PYTHON_API_URL}/trending-recommendations`, { userId });
//     return response.data;
//   };
  
