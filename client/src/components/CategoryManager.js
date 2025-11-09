import React, { useEffect, useState } from 'react';
import '../DashboardContent.css';
import Cookies from 'js-cookie';

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/types')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleAddCategory = () => {
    fetch('http://localhost:8000/api/types', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newCategoryName }),
    })
    .then(response => response.json())
    .then(newCategory => {
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
    })
    .catch(error => console.error('Error adding category:', error));
  };

  const handleUpdateCategory = (id) => {
    fetch(`http://localhost:8000/api/types/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: editingCategoryName }),
    })
    .then(response => response.json())
    .then(updatedCategory => {
      setCategories(categories.map(category => category.id === id ? updatedCategory : category));
      setEditingCategory(null);
    })
    .catch(error => console.error('Error updating category:', error));
  };

  const handleDeleteCategory = (id) => {
    fetch(`http://localhost:8000/api/types/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      setCategories(categories.filter(category => category.id !== id));
    })
    .catch(error => console.error('Error deleting category:', error));
  };

  return (
    <div className="category-manager p-4 bg-white shadow-md rounded-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Categories</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 flex-1"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Category
        </button>
      </div>
      <ul className="divide-y divide-gray-200">
        {categories.map(category => (
          <li key={category.id} className="flex items-center justify-between py-2">
            {editingCategory === category.id ? (
              <input
                type="text"
                value={editingCategoryName}
                onChange={(e) => setEditingCategoryName(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 flex-1"
              />
            ) : (
              <span className="flex-1 text-gray-800">{category.name}</span>
            )}
            <div className="flex space-x-2">
              {editingCategory === category.id ? (
                <button
                  onClick={() => handleUpdateCategory(category.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditingCategory(category.id);
                    setEditingCategoryName(category.name);
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryManager;
