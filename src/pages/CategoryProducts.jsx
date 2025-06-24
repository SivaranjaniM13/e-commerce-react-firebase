import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [role, setRole] = useState("");
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      }
    };
    fetchRole();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const categoryRef = doc(db, "categories", categoryName);
      const productsSnap = await getDocs(collection(categoryRef, "products"));
      const productList = [];
      productsSnap.forEach((doc) =>
        productList.push({ id: doc.id, ...doc.data() })
      );
      setProducts(productList);
    };

    fetchProducts();
  }, [categoryName]);

  const handleQtyChange = (productId, qty) => {
    setQuantities({ ...quantities, [productId]: Number(qty) });
  };

  const handleAddToCart = async (product) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add to cart.");
      return;
    }

    const quantity = quantities[product.id] || 1;

    const cartItemRef = doc(db, "cart", user.uid, "items", product.id);
    await setDoc(cartItemRef, {
      ...product,
      quantity,
    });

    alert("Item added to cart!");
  };

  return (
    <div className="min-h-screen bg-purple-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-indigo-600 hover:underline"
        >
          ← Back to Categories
        </button>

        <h2 className="text-3xl font-extrabold text-indigo-900 mb-8">
          Products in {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center transition hover:shadow-lg"
            >
              <div className="w-48 h-48 mb-4 rounded overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-1 text-center">{product.description}</p>
              <p className="text-emerald-600 font-semibold text-lg mb-3">₹{product.price}</p>

              {role === "customer" && (
                <>
                  <div className="flex items-center mb-2">
                    <label className="text-sm text-gray-700 mr-2">Qty:</label>
                    <input
                      type="number"
                      min="1"
                      value={quantities[product.id] || 1}
                      onChange={(e) => handleQtyChange(product.id, e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300"
                    />
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded transition"
                  >
                    Add to Cart
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;
