import React, { useState, useEffect } from "react";
import api from "../../services/api";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await api.get("categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("categories/", {
        name,
        description,
      });
      setCategories([...categories, response.data]);
      setName("");
      setDescription("");
    } catch (err) {
      setError("Failed to add category");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <form className="mb-6" onSubmit={handleAddCategory}>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          className="w-full bg-green-500 text-white p-2 rounded"
          type="submit"
        >
          Add Category
        </button>
      </form>
      <div>
        {categories.map((category) => (
          <div key={category.id} className="border p-4 mb-2 rounded">
            <h3 className="text-xl">{category.name}</h3>
            <p>{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
