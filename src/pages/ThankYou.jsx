import React from "react";

const ThankYou = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center animate-fade-in">
        <h1 className="text-4xl font-extrabold text-emerald-600 mb-4">
          Thank You!
        </h1>
        <p className="text-slate-700 text-lg">
          Your order has been placed successfully.
        </p>
        <div className="mt-6">
          <a
            href="/categories"
            className="inline-block bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 transition"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
