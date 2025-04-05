import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import img from './assets/th.jpeg'

function App() {
  // State for products from API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [userdata, setUserdata]  = useState({});
  const [allproduct,setAllproduct] = useState([]);
  


useEffect(() => {
    setLoading(true);
    axios
      .get("https://multi-agent-recommendation-system.onrender.com/api/products") // Change the API URL if needed
      .then((response) => {
        const limitedProducts = response.data.slice(0, 100); // Take only the first 100 products
        setAllproduct(response.data);
        setProducts(limitedProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      });
  }, []);

  console.log(products)

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [userId, setUserId] = useState(null);



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://multi-agent-recommendation-system.onrender.com/api/profile", {
          headers: {
            "Content-Type": "application/json",
            "userId": localStorage.getItem("userId"), // Fetch userId from local storage
          },
          withCredentials: true, // If using authentication
        });
  
        console.log("UserData received!", response.data);
        // setUserdata(response.data);
  
        // Once userdata is set, fetch recommendations
        getRecommendations(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    const getRecommendations = async (userData) => {
      try {
        if (!userData || Object.keys(userData).length === 0) {
          console.error("User data is empty, skipping recommendations request");
          return;
        }
  
        console.log("Sending userdata:", userData);
  
        const response = await axios.post("https://multi-agent-recommendation-system-1.onrender.com/recommend-products", {
          userdata: userData,
        });
        console.log(response)
  
        console.log("Recommended Products:", response.data);
        setRecommend(response.data["Extracted Product IDs"]);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };
  
    fetchUserData();
  }, []);

  console.log("Recommend: ",recommend);



  useEffect(() => {

    const fetchRecommendedProducts = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        setUserId(storedUserId);
        const response = await axios.get(`https://multi-agent-recommendation-system.onrender.com/recommendations/${userId}`);
        setRecommend(response.data.productIds || []);
      } catch (error) {
        console.error("Failed to fetch recommended products:", error);
      }
    };

    if (userId) {
      fetchRecommendedProducts();
    }
  }, [userId]);
  
  




  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);
  
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
  
      return [...prevCart, { ...product, quantity: 1 }];
    });
    axios.post("http://localhost:3000/api/cart/add", { product })
    .then(response => console.log("Product added to cart:", response.data))
    .catch(error => console.error("Error adding to cart:", error));

  };

  
  
  console.log("cart items: ",cart);

  
  useEffect(() => {
    if (products.length > 0) {
      setFilteredProducts(
        products.filter(product => {
          const subcategory = product?.Subcategory ? product.Subcategory.toLowerCase() : "";
          const category = product?.Category ? product.Category.toLowerCase() : "";
          return subcategory.includes(searchTerm.toLowerCase()) || category.includes(searchTerm.toLowerCase());
        })
      );
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);



  

  

  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
   
  };

  // Get trending products
  const trendingProducts = products.filter(product => product.trending);

  return (
    <div className="App">
      <Navbar onSearchChange={handleSearchChange} searchTerm={searchTerm} />
      <main>
        {/* <JsonUploader/> */}
        <HeroSection />
        
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <> {recommend.length !==0 ?
             (
            <RecommendedProducts products={allproduct} addToCart={addToCart} recommendedProducts ={recommend} />
            ):<></>
           }
            <AllProducts products={filteredProducts} addToCart={addToCart} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading products...</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="error-container">
      <p>{message}</p>
      <button onClick={() => window.location.reload()} className="retry-button">
        Try Again
      </button>
    </div>
  );
}


function JsonUploader(){
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("❗Please select a JSON file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/upload-json", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ " + result.message);
      } else {
        setMessage("❌ " + (result.error || "Upload failed."));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("❌ Error uploading file.");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Upload JSON File</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".json" onChange={handleFileChange} />
        <br />
        <button type="submit" style={{ marginTop: "15px" }}>
          Upload
        </button>
      </form>
      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
};







function Navbar({ onSearchChange, searchTerm }) {
  const [showRegister, setShowRegister] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    age: "",
    gender: "",
    location: "",
  });

  
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);
  

  console.log(userId)



  const handleRegisterClick = (e) => {
    e.preventDefault();
    setShowRegister(true);
  };

  const handleCloseForm = () => {
    setShowRegister(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/register",
        {
          ...formData,
          age: parseInt(formData.age), // ensure age is a number
        }, 
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.data;
      console.log("data", data);
      if (response.status === 201) {
        alert("Registration Successful!");
        localStorage.setItem("userId", data.userId);
        setShowRegister(false);
        window.location.reload();
      } else {
        alert(data.message || "Registration Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };


  const trackSearch = async (query) => {
    const userId = localStorage.getItem("userId"); // Get stored user ID
  
    if (!userId || !query.trim()) return; // Skip if no user or empty search
    console.log(query);
    console.log("useriiddd :",userId);
  
    try {
      await axios.post("https://multi-agent-recommendation-system.onrender.com/api/track-search", {
        userId,
        query,
      });
    }catch (error) {
      console.error("Error tracking search:", error);
    }
  };




  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    console.log("Submitted Search Term:", searchTerm); // Log or use the search term
    trackSearch(searchTerm);
    // Pass value to parent component if needed
  };

  

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <a href="/" className="navbar-logo">ShopEasy</a>
          <form onSubmit={handleSearchSubmit} className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={onSearchChange}
            />
           <button type="submit">Search</button>
         </form>
          <ul className="nav-menu">
            <li className="nav-item"><a href="/" className="nav-link">Home</a></li>
            <li className="nav-item"><a href="/categories" className="nav-link">Categories</a></li>
            <li className="nav-item"><a href="/deals" className="nav-link">Deals</a></li>
            <li className="nav-item"><a href="/account" className="nav-link" onClick={handleRegisterClick}>Account</a></li>
            <li className="nav-item cart-icon">
              <a href="/cart" className="nav-link">
                <span className="material-icons">shopping_cart</span>
                <span className="cart-count">0</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {showRegister && (
        <div className="register-form-overlay">
          <div className="register-form">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
              <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} required />
              <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
              <button type="submit">Register</button>
              <button type="button" onClick={handleCloseForm} className="close-btn">Close</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}




function RecommendedProducts({ products, addToCart, recommendedProducts  = []  }) {
  console.log("Recomme",recommendedProducts)
  const filteredProducts = products.filter(product =>  recommendedProducts.length > 0 && recommendedProducts?.includes(product.Product_ID));
  return (
    <section className="all-products-section">
       <div className="section-header">
         <h2>Recommended Products</h2>
         </div>
      {filteredProducts.length === 0 ? (
        <p className="no-results">No recommended products found.</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      )}
    </section>
  );
}








function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Spring Sale</h1>
        <p>Up to 50% off on selected items</p>
        <button className="shop-now-btn">Shop Now</button>
      </div>
    </section>
  );
}

function TrendingProducts({ products }) {
  if (products.length === 0) {
    return null;
  }
  
  return (
    <section className="trending-section">
      <div className="section-header">
        <h2>Trending Now</h2>
        <a href="/trending" className="view-all">View All</a>
      </div>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart}/>
        ))}
      </div>
    </section>
  );
}




function AllProducts({ products,addToCart }) {
  const [sortOption, setSortOption] = useState("");
  
  // Sort products based on the selected option
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "price-low") {
      return a.Price - b.Price;
    } else if (sortOption === "price-high") {
      return b.Price - a.Price;
    } else if (sortOption === "newest") {
      // Assuming there's a createdAt or date field
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    return 0;
  });

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <section className="all-products-section">
      <div className="section-header">
        <h2>All Products</h2>
        <div className="filter-options">
          <select value={sortOption} onChange={handleSortChange}>
            <option value="" disabled>Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
      {products.length === 0 ? (
        <p className="no-results">No products found. Try a different search term.</p>
      ) : (
        <div className="products-grid">
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart}/>
          ))}
        </div>
      )}
    </section>
  );
}



function ProductCard({ product, addToCart }) {
  // Handle potential missing data or format issues
  const formatPrice = (price) => {
    if (price === undefined || price === null) return "Price unavailable";
    return `₹${parseFloat(price).toFixed(2)}`;
  };
  
  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={img} 
          alt={product.name} 
          onError={(e) => {
            e.target.src = "/api/placeholder/300/300"; // Fallback image
          }}
        />
        {product.trending && <span className="trending-badge">Trending</span>}
      </div>
      <div className="product-info">
        <h3>{product.Subcategory}</h3>
        <p className="product-category">{product.Category}</p>
        <p className="product-price">{formatPrice(product.Price)}</p>
        <button className="add-to-cart" onClick={() => addToCart(product)} >Add to Cart</button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Shop</h3>
          <ul>
            <li><a href="/new-arrivals">New Arrivals</a></li>
            <li><a href="/bestsellers">Bestsellers</a></li>
            <li><a href="/deals">Deals & Offers</a></li>
            <li><a href="/gift-cards">Gift Cards</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/faq">FAQs</a></li>
            <li><a href="/shipping">Shipping & Returns</a></li>
            <li><a href="/size-guide">Size Guide</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>About</h3>
          <ul>
            <li><a href="/our-story">Our Story</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/sustainability">Sustainability</a></li>
            <li><a href="/press">Press</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Stay Connected</h3>
          <div className="social-icons">
            <a href="#" className="social-icon">FB</a>
            <a href="#" className="social-icon">IG</a>
            <a href="#" className="social-icon">TW</a>
            <a href="#" className="social-icon">YT</a>
          </div>
          <div className="newsletter">
            <p>Sign up for our newsletter</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>© 2025 ShopEasy. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default App;