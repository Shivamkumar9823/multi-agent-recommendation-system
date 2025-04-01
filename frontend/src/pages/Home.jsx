import React, { useState, useEffect } from 'react';
import { getProductRecommendations } from '../services/api';

const Home = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Add a loading state

  const dummyUserData = {
    username: "testuser",
    Age: 25,
    Gender: "male",
    Location: "New York",
    Browsing_History: ["electronics", "laptops"],
    Purchase_History: [{ item: "iPhone 14", category: "electronics" }],
    Customer_Segment: "Frequent Buyer",
    Avg_Order_Value: 500,
    Holiday:'NO',
    Season:'Winter'
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true); // ✅ Start loading
      try {
        const data = await getProductRecommendations(dummyUserData);
        setRecommendations(data); // Store the recommendations
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
      setLoading(false); // ✅ Stop loading
    };

    fetchRecommendations();
  }, []); // ✅ Run only once on mount

  return (
    <div className='Home'>
      <h1>Welcome to the E-commerce Platform</h1>
      <p>You have successfully registered!</p>

      {loading ? (
        <p>Loading recommendations...</p> // ✅ Show loader while fetching
        ) : recommendations ? (
          <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
           {JSON.stringify(recommendations, null, 2)}
          </pre>
      ) : (
        <p>Loading recommendations...</p>
      )
    }
    </div>
  );
};

export default Home;
