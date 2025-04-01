import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Home from './pages/Home';
import UploadProduct from './pages/UploadProduct';
import './App.css';

function App() {
  return (
    <div className="app"> 
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/upload" element={<UploadProduct />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
