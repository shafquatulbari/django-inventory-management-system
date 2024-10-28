import React, { useState, useEffect } from "react";
import api from "../../services/api";

const ProductForm = ({ product = null, onSave }) => {
  const [name, setName] = useState(product ? product.name : "");
  const [category, setCategory] = useState(product ? product.category : "");
  const [price, setPrice] = useState(product ? product.price : "");
  const [quantity, setQuantity] = useState(product ? product.quantity : "");
  const [description, setDescription] = useState(
    product ? product.description : ""
  );
  const [stockLevel, setStockLevel] = useState(
    product ? product.stock_level : ""
  );
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await api.get("categories/");
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      category,
      price,
      quantity,
      description,
      stock_level: stockLevel,
    };

    try {
      if (product) {
        await api.put(`products/update/${product.id}/`, data);
      } else {
        await api.post("products/add/", data);
      }
      onSave();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {product ? "Edit" : "Add"} Product
      </h2>
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
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Stock Level"
        value={stockLevel}
        onChange={(e) => setStockLevel(e.target.value)}
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
