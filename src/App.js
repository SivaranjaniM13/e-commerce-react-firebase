import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Categories from "./pages/Categories";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AddProduct from "./pages/AddProduct";
import CategoryProducts from "./pages/CategoryProducts";
import CartCheckout from "./pages/CartCheckout";
import PurchaseHistory from "./pages/PurchaseHistory";
import ThankYou from "./pages/ThankYou";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/categories/:categoryName" element={<CategoryProducts />} />
        <Route path="/cart" element={<CartCheckout />} />
        <Route path="/history" element={<PurchaseHistory />} />
        <Route path="/thankyou" element={<ThankYou />} />
        
      </Routes>
    </Router>
  );
}

export default App;
