import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [user] = useAuthState(auth);
  const [wishlist, setWishlist] = useState({});
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const categoryRef = collection(db, "categories", categoryName, "products");
      const querySnapshot = await getDocs(categoryRef);
      const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    };
    fetchProducts();
  }, [categoryName]);

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      const wishlistRef = collection(db, "users", user.uid, "wishlist");
      const wishlistSnap = await getDocs(wishlistRef);
      const list = {};
      wishlistSnap.forEach(doc => {
        list[doc.id] = true;
      });
      setWishlist(list);
    };
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) {
      alert("Please log in to manage wishlist.");
      return;
    }

    const wishlistRef = doc(db, "users", user.uid, "wishlist", product.id);
    const isWishlisted = wishlist[product.id];

    if (isWishlisted) {
      await deleteDoc(wishlistRef);
    } else {
      await setDoc(wishlistRef, {
        name: product.name,
        price: product.price,
        image: product.image,
        timestamp: Date.now(),
      });
    }

    setWishlist(prev => ({
      ...prev,
      [product.id]: !isWishlisted
    }));
  };

  const handleQuantityChange = (productId, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities(prev => ({
      ...prev,
      [productId]: qty
    }));
  };

  const addToCart = async (product) => {
  if (!user) {
    alert("Please log in to add items to cart.");
    return;
  }

  const quantity = quantities[product.id] || 1;
  const cartRef = doc(db, "cart", user.uid, "items", product.id);

  await setDoc(cartRef, {
    name: product.name,
    price: product.price,
    image: product.image,
    quantity,
    timestamp: new Date(),
  });

  alert(`${product.name} added to cart.`);
};

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (maxPrice === "" || product.price <= parseFloat(maxPrice))
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Products in {categoryName}</h1>
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-indigo-600 hover:underline"
      >
        ← Back
      </button>

      {/* Filter section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full sm:w-1/2"
        />
        <input
          type="number"
          placeholder="Max price..."
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full sm:w-1/2"
        />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="relative bg-white rounded-lg shadow-md p-5 flex flex-col items-center transition hover:shadow-lg"
          >
            {/* Wishlist icon */}
            <div className="absolute top-3 right-3 text-xl text-red-600 cursor-pointer">
              <button onClick={() => toggleWishlist(product)}>
                {wishlist[product.id] ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>

            <img src={product.image} alt={product.name} className="w-40 h-40 object-cover rounded mb-4" />
            <h2 className="text-lg font-semibold mb-1 text-center">{product.name}</h2>
            <p className="text-gray-600 text-sm mb-1">₹{product.price}</p>
            <p className="text-gray-500 text-sm text-center mb-3">{product.description}</p>

            {/* Quantity selector */}
            <div className="flex items-center gap-2 mb-2">
              <label htmlFor={`qty-${product.id}`} className="text-sm">Qty:</label>
              <input
                type="number"
                id={`qty-${product.id}`}
                min="1"
                value={quantities[product.id] || 1}
                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                className="w-16 px-2 py-1 border border-gray-300 rounded"
              />
            </div>

            {/* Add to cart button */}
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;
