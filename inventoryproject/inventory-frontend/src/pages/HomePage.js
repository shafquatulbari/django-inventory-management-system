import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold mb-6">
        Welcome to the Inventory Management System
      </h1>
      <div className="flex">
        <Link
          to="/products"
          className="bg-blue-500 text-white p-4 rounded mr-4"
        >
          View Products
        </Link>
        <Link to="/categories" className="bg-green-500 text-white p-4 rounded">
          View Categories
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
