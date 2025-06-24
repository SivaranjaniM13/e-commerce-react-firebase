import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const PurchaseHistory = () => {
  const [orders, setOrders] = useState([]);
  const userId = auth.currentUser?.uid;
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let snap;

        if (role === "admin") {
          snap = await getDocs(collection(db, "orders"));
        } else {
          const q = query(collection(db, "orders"), where("userId", "==", userId));
          snap = await getDocs(q);
        }

        const allOrders = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(allOrders);
      } catch (err) {
        console.error("Error fetching orders:", err.message);
      }
    };

    fetchOrders();
  }, [role, userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
        {role === "admin" ? "All Orders (Admin)" : "My Orders"}
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No orders found.</p>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {orders.map((order) => (
            <div key={order.id} className="border border-slate-200 bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-2">
                {role === "admin" && (
                  <p className="text-sm text-gray-500">
                    <strong>User ID:</strong> {order.userId}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Total:</strong> ₹{order.total}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong>{" "}
                  {order.timestamp?.seconds
                    ? new Date(order.timestamp.seconds * 1000).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              <ul className="list-disc list-inside text-sm text-gray-700">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.quantity || 1} – ₹
                    {item.price * (item.quantity || 1)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
