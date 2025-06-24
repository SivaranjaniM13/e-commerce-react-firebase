import React, { useEffect, useState } from "react";

const Home = () => {
  const [username, setUsername] = useState(localStorage.getItem("username"));

  useEffect(() => {
    const updateUsername = () => {
      setUsername(localStorage.getItem("username"));
    };

    window.addEventListener("storage", updateUsername);
    updateUsername();

    return () => {
      window.removeEventListener("storage", updateUsername);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-purple-300 text-gray-800 text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-indigo-900 mb-6 drop-shadow-md transition-all duration-300">
        {username ? `Welcome, ${username}!` : "Welcome to Shop Smart"}
      </h1>

      <p className="text-lg sm:text-xl text-gray-700 max-w-2xl leading-relaxed">
        Explore our handpicked collections and amazing deals.{" "}
        <span className="text-emerald-600 font-semibold">Shop smarter, live better!</span>
      </p>

      <div className="mt-8">
        <a
          href="/categories"
          className="inline-block bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          Browse Categories
        </a>
      </div>
    </div>
  );
};

export default Home;
