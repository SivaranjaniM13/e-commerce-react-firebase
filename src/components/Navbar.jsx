import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const [role, setRole] = useState(localStorage.getItem("userRole") || "");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("userRole") || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    setMenuOpen(false); // close menu after logout
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false); // helper function to close mobile menu

  return (
    <nav className="bg-purple-200 shadow-md px-6 py-3 border-b border-purple-300">
      <div className="flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-800 hover:text-indigo-900 transition"
        >
          Shop Smart
        </Link>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-indigo-800">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center text-gray-700 text-sm font-medium">
          <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
          <Link to="/about" className="hover:text-indigo-600 transition">About</Link>
          <Link to="/categories" className="hover:text-indigo-600 transition">Categories</Link>

          {role === "admin" && (
            <Link to="/add-product" className="hover:text-indigo-600 transition">Add Product</Link>
          )}

          {role === "customer" && (
            <>
              <Link to="/cart" className="hover:text-indigo-600 transition">Cart</Link>
              <Link to="/history" className="hover:text-indigo-600 transition">My Orders</Link>
            </>
          )}

          {role === "admin" && (
            <Link to="/history" className="hover:text-indigo-600 transition">All Orders</Link>
          )}

          {role ? (
            <button
              onClick={handleLogout}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded transition"
            >
              Sign Up
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2 text-gray-700 text-sm font-medium">
          <Link to="/" onClick={closeMenu} className="hover:text-indigo-600 transition">Home</Link>
          <Link to="/about" onClick={closeMenu} className="hover:text-indigo-600 transition">About</Link>
          <Link to="/categories" onClick={closeMenu} className="hover:text-indigo-600 transition">Categories</Link>

          {role === "admin" && (
            <Link to="/add-product" onClick={closeMenu} className="hover:text-indigo-600 transition">Add Product</Link>
          )}

          {role === "customer" && (
            <>
              <Link to="/cart" onClick={closeMenu} className="hover:text-indigo-600 transition">Cart</Link>
              <Link to="/history" onClick={closeMenu} className="hover:text-indigo-600 transition">My Orders</Link>
            </>
          )}

          {role === "admin" && (
            <Link to="/history" onClick={closeMenu} className="hover:text-indigo-600 transition">All Orders</Link>
          )}

          {role ? (
            <button
              onClick={handleLogout}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded transition text-left"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/signup"
              onClick={closeMenu}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded transition"
            >
              Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
