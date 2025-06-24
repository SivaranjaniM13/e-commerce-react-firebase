import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  doc,
  getDocs,
} from "firebase/firestore";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    description: "",
    price: "",
    image: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoryList = querySnapshot.docs.map((doc) => doc.id);
        setCategories(categoryList);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const categoryRef = doc(db, "categories", formData.category);

      await addDoc(collection(categoryRef, "products"), {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image,
      });

      setMessage("✅ Product added successfully!");
      setFormData({
        category: "",
        name: "",
        description: "",
        price: "",
        image: "",
      });
    } catch (err) {
      console.error("Error adding product:", err);
      setMessage("❌ Failed to add product.");
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-indigo-600 hover:underline"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-extrabold text-indigo-900 mb-4">Add New Product</h2>

        {message && (
          <div
            className={`mb-4 text-sm font-medium px-4 py-2 rounded ${
              message.includes("✅")
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <input
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="price"
            placeholder="Price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow transition"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
