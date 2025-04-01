import React, { useState } from "react";
import axios from "axios";
import "./UploadProduct.css";


const UploadProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    imageUrl: "",
    stock: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:3000/api/products/upload", formData, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage("Product uploaded successfully!");
      setFormData({
        name: "",
        brand: "",
        description: "",
        price: "",
        category: "",
        subcategory: "",
        imageUrl: "",
        stock: "",
      });
    } catch (error) {
      setMessage("Failed to upload product.");
      console.error("Error uploading product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Upload Product</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
        <input type="text" name="subcategory" placeholder="Subcategory" value={formData.subcategory} onChange={handleChange} />
        <input type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} required />
        <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
        <button type="submit" disabled={loading}>{loading ? "Uploading..." : "Upload Product"}</button>
      </form>
    </div>
  );
};

export default UploadProduct;
