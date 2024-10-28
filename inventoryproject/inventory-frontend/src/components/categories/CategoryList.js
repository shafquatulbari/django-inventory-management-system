import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(AuthContext);

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

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description);
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Update existing category
        const response = await api.put(`categories/${editingCategory.id}/`, {
          name,
          description,
        });
        const updatedCategories = categories.map((cat) =>
          cat.id === editingCategory.id ? response.data : cat
        );
        setCategories(updatedCategories);
      } else {
        // Add a new category
        const response = await api.post("categories/", {
          name,
          description,
        });
        setCategories([...categories, response.data]);
      }
      setName("");
      setDescription("");
      setEditingCategory(null);
      setShowForm(false);
    } catch (err) {
      setError("Failed to save category");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>

      {/* Admin-specific form */}
      {user && user.is_admin && (
        <>
          <button
            className="bg-green-500 text-white p-2 rounded mb-4"
            onClick={handleAddCategory}
          >
            {editingCategory ? "Edit Category" : "Add Category"}
          </button>

          {showForm && (
            <form className="mb-6" onSubmit={handleFormSubmit}>
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
                className="w-full bg-blue-500 text-white p-2 rounded"
                type="submit"
              >
                {editingCategory ? "Update Category" : "Add Category"}
              </button>
            </form>
          )}
        </>
      )}

      {/* Display category list */}
      <div>
        {categories.map((category) => (
          <div key={category.id} className="border p-4 mb-2 rounded">
            <h3 className="text-xl">{category.name}</h3>
            <p>{category.description}</p>
            {user && user.is_admin && (
              <button
                className="bg-yellow-500 text-white p-2 rounded mt-2"
                onClick={() => handleEditCategory(category)}
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
