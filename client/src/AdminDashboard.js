import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import './AdminDashboard.css';

import DetailsArticle from './DetailsArticle';


function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);


  useEffect(() => {
     fetchUsers();
    fetchArticles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Error fetching users:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      } else {
        console.error("Error fetching articles:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const handleUserUpdate = async (id, user) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      console.log(response)
      if (response.ok) {
        fetchUsers();
      } else {
        console.error("Error updating user:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleArticleUpdate = async (id, article) => {
    try {
      const response = await fetch(`http://localhost:8000/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      });

      if (response.ok) {
        fetchArticles();
      } else {
        console.error("Error", response.statusText);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleArticleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/articles/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchArticles();
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="content">
        <DashboardContent
          users={users}
          articles={articles}
          onUserUpdate={handleUserUpdate}
          onArticleUpdate={handleArticleUpdate}
          onArticleDelete={handleArticleDelete}
        />
        
      </div>
    </div>
  );
}

export default AdminDashboard;