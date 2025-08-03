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
import Wishlist from './pages/Wishlist';
import { AuthProvider } from "./context/AuthContext";
import FloatingHelpButton from './components/FloatingHelpButton';
import ScrollToTopButton from './components/ScrollToTopButton';

function App() {
  return (
    <AuthProvider>
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
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
      <FloatingHelpButton />
      <ScrollToTopButton />
    </Router>
    </AuthProvider>
  );
}

export default App;
