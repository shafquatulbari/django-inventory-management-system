import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header/header";
import { AuthContext } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-5xl font-bold mb-6">
          {user
            ? user.is_admin
              ? `Hi, ${user.username}, welcome to the admin dashboard`
              : `Hello ${user.username}, welcome to the user dashboard`
            : "Loading..."}
        </h1>
        {user && (
          <div className="flex">
            <Link
              to="/products"
              className="bg-blue-500 text-white p-4 rounded mr-4"
            >
              View Products
            </Link>
            <Link
              to="/categories"
              className="bg-green-500 text-white p-4 rounded"
            >
              View Categories
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
