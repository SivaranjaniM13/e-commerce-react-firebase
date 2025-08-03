import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function Wishlist() {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (currentUser) {
        const ref = collection(db, "users", currentUser.uid, "wishlist");
        const snap = await getDocs(ref);
        const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWishlist(items);
      }
    };
    fetchWishlist();
  }, [currentUser]);

  return (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {wishlist.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center transition hover:shadow-lg"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-40 h-40 object-cover rounded mb-4"
          />
          <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
          <p className="text-gray-600 text-sm mb-2">₹{item.price}</p>
        </div>
      ))}
    </div>
  </div>
);

}
