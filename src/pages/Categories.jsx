import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      setCategories(snapshot.docs.map(doc => doc.id));
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-purple-100 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-indigo-600 hover:underline"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-extrabold text-indigo-900 mb-6">All Categories</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/categories/${category}`}
              className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center shadow-sm hover:shadow-md hover:bg-indigo-50 text-lg font-semibold text-gray-800 transition"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
