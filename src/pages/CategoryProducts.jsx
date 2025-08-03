import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      const categoryRef = collection(db, "categories", categoryName, "products");
      const querySnapshot = await getDocs(categoryRef);
      const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    };

    fetchProducts();
  }, [categoryName]);

  // Fetch wishlist of current user
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

  // Wishlist toggle function
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

  // Filter logic
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
            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 text-sm mb-2">₹{product.price}</p>
            <p className="text-gray-500 text-sm text-center">{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;
