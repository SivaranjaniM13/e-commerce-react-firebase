import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const [role, setRole] = useState(localStorage.getItem("userRole") || "");
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
    navigate("/");
  };

  return (
    <nav className="bg-purple-200 shadow-md px-6 py-3 flex justify-between items-center border-b border-purple-300">
      <Link to="/" className="text-2xl font-bold text-indigo-800 hover:text-indigo-900 transition">
        Shop Smart
      </Link>

      <div className="space-x-4 flex items-center text-gray-700 text-sm font-medium">
        <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
        <Link to="/about" className="hover:text-indigo-600 transition">About</Link>
        <Link to="/categories" className="hover:text-indigo-600 transition">Categories</Link>
        {role === "admin" && (
          <Link to="/add-product" className="hover:text-indigo-600 transition">
            Add Product
          </Link>
        )}

        {role === "customer" && (
          <>
            <Link to="/cart" className="hover:text-indigo-600 transition">Cart</Link>
            <Link to="/history" className="hover:text-indigo-600 transition">My Orders</Link>
          </>
        )}

        {role === "admin" && (
          <Link to="/history" className="hover:text-indigo-600 transition">
            All Orders
          </Link>
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
    </nav>
  );
};

export default Navbar;
