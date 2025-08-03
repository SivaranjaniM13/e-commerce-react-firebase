import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CartCheckout = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const userId = auth.currentUser?.uid;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;

      const snap = await getDocs(collection(db, "cart", userId, "items"));
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      const data = snap.docs.map((doc) => {
        const item = doc.data();
        const addedTime = item.timestamp?.toDate?.().getTime?.() || 0;

        return {
          id: doc.id,
          ...item,
          quantity: item.quantity || 1,
          isNew: now - addedTime <= fiveMinutes,
        };
      });

      setItems(data);
    };

    fetchCart();
  }, [userId]);

  useEffect(() => {
    const totalAmount = items.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0
    );
    setTotal(totalAmount);
  }, [items]);

  const handleQuantityChange = async (itemId, type) => {
    const item = items.find((i) => i.id === itemId);
    let newQty = item.quantity;

    if (type === "inc") {
      newQty++;
    } else if (type === "dec" && newQty > 1) {
      newQty--;
    } else {
      return;
    }

    const itemRef = doc(db, "cart", userId, "items", itemId);
    await updateDoc(itemRef, { quantity: newQty });

    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, quantity: newQty } : i
      )
    );
  };

  const handleRemove = async (itemId) => {
    await deleteDoc(doc(db, "cart", userId, "items", itemId));
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }

    await addDoc(collection(db, "orders"), {
      userId,
      items,
      total,
      timestamp: serverTimestamp(),
    });

    const batchDeletes = items.map((item) =>
      deleteDoc(doc(db, "cart", userId, "items", item.id))
    );
    await Promise.all(batchDeletes);

    alert("Order placed successfully!");
    navigate("/thankyou");
  };

  return (
    <div className="min-h-screen bg-purple-100 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-3xl font-extrabold text-indigo-900 mb-6">My Cart & Checkout</h2>

        {items.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 border border-gray-200 p-4 mb-4 rounded-lg flex justify-between items-center shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                    {item.isNew && (
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">₹{item.price}</p>
                  <div className="flex items-center mt-2 gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, "dec")}
                      className="bg-gray-300 px-2 rounded hover:bg-gray-400 transition"
                    >
                      −
                    </button>
                    <span className="px-2 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, "inc")}
                      className="bg-gray-300 px-2 rounded hover:bg-gray-400 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="text-right mt-6">
              <p className="text-xl font-bold text-gray-800">Total: ₹{total}</p>
              <button
                onClick={handleCheckout}
                className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartCheckout;
