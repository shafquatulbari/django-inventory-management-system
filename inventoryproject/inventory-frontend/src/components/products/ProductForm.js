import React, { useState, useEffect } from "react";
import api from "../../services/api";

const ProductForm = ({ product = null, onSave }) => {
  const [name, setName] = useState(product ? product.name : "");
  const [category, setCategory] = useState(product ? product.category : "");
  const [price, setPrice] = useState(product ? product.price : "");
  const [quantityChange, setQuantityChange] = useState(0);
  const [quantityOperation, setQuantityOperation] = useState("Add"); // New state for operation
  const [description, setDescription] = useState(
    product ? product.description : ""
  );
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(""); // New state to store error message

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await api.get("categories/");
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message before submission

    const adjustedQuantity =
      quantityOperation === "Add" ? quantityChange : -quantityChange; // Calculate based on selected operation

    const data = {
      name,
      category,
      price,
      quantity: adjustedQuantity,
      description,
    };

    try {
      if (product) {
        // Update the product with adjusted quantity
        const response = await api.put(`products/update/${product.id}/`, {
          ...data,
          quantityChange: adjustedQuantity, // Send adjusted quantity to backend
        });

        // Check if the backend returned an error
        if (response.data.error) {
          setError(response.data.error); // Display error on the screen
        } else {
          onSave();
        }
      } else {
        // Add new product
        await api.post("products/add/", data);
        onSave();
      }
    } catch (error) {
      setError("Quantity cannot be less than 1!"); // Display a generic error message for unexpected issues
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {product ? "Edit" : "Add"} Product
      </h2>

      {/* Display error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      {/* Quantity Adjustment */}
      {product && (
        <div className="flex items-center mb-4">
          <select
            value={quantityOperation}
            onChange={(e) => setQuantityOperation(e.target.value)}
            className="p-2 border rounded mr-2"
          >
            <option value="Add">Add Quantity</option>
            <option value="Subtract">Remove Quantity</option>
          </select>
          <input
            type="number"
            placeholder="Quantity Adjustment"
            value={quantityChange}
            onChange={(e) =>
              setQuantityChange(Math.max(0, parseInt(e.target.value) || 0))
            }
            className="w-1/3 p-2 border rounded text-center"
          />
        </div>
      )}

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        className="w-full bg-blue-500 text-white p-2 rounded"
        type="submit"
      >
        {product ? "Update" : "Add"} Product
      </button>
    </form>
  );
};

export default ProductForm;
