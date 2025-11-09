import React, { useEffect, useState } from 'react';
import './DashboardContent.css';
import Cookies from 'js-cookie';

function DashboardContent() {
  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);
  const [newArticleData, setNewArticleData] = useState({
    title: '', content: '', image1: '', image2: '', image3: '', price: '', id_type: '', stock: '', recommandation: 0, color: ''
  });
  const [admin, setAdmin] = useState(false);
  const [newArticleFormVisible, setNewArticleFormVisible] = useState(false);
  const [articleColors, setArticleColors] = useState({});

  useEffect(() => {

    
    fetch('http://localhost:8000/api/AllArticles')


    fetch('http://localhost:8000/api/users')
      .then(response => response.json())
      // .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));

    fetch('http://localhost:8000/api/AllArticles')

      .then(response => response.json())
      .then(data => setArticles(data))
      .catch(error => console.error('Error fetching articles:', error));
  }, []);

  useEffect(() => {
    articles.forEach(article => {
      fetch(`http://localhost:8000/api/articles/${article.id}/colors`)
        .then(response => response.json())
        .then(data => {
          setArticleColors(prevColors => ({ ...prevColors, [article.id]: data }));
        })
        .catch(error => console.error('Error fetching article colors:', error));
    });
  }, [articles]);

  const handleAddrecommandation = (id) => {
    fetch('http://localhost:8000/api/articles/recommandation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recommandation: 'true', id_article: id }),
    })
      .then(response => response.json());
  }

  const handleRemoverecommandation = (id) => {
    fetch('http://localhost:8000/api/articles/recommandation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recommandation: 'false', id_article: id }),
    })
      .then(response => response.json());
  }

  const handleEditClick = (article) => {
    setEditingArticle(article.id);
    setNewArticleData(article);
  };

  const handleSaveClick = () => {
    fetch(`http://localhost:8000/api/articles/${editingArticle}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newArticleData),
    })
      .then(response => response.json())
      .then(updatedArticle => {
        setArticles(articles.map(article => article.id === editingArticle ? updatedArticle : article));
        setEditingArticle(null);
      })
      .catch(error => console.error('Error updating article:', error));
  };

  const handleDeleteClick = (id) => {
    fetch(`http://localhost:8000/api/articles/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setArticles(articles.filter(article => article.id !== id));
      })
      .catch(error => console.error('Error deleting article:', error));
  };

  const handleChange = (e) => {
    setNewArticleData({ ...newArticleData, [e.target.name]: e.target.value });
  };

  const handleColorChange = (articleId, e) => {
    const selectedColor = articleColors[articleId].find(color => color.color === e.target.value);
    setNewArticleData(prevData => ({
      ...prevData,
      color: selectedColor.color,
      image1: selectedColor.image1,
      image2: selectedColor.image2,
      image3: selectedColor.image3,
      price: selectedColor.price
    }));

    
    setArticles(prevArticles => prevArticles.map(article => 
      article.id === articleId ? { ...article, color: selectedColor.color } : article
    ));
  };

  const handleAddArticleClick = () => {
    setNewArticleFormVisible(true);
    setNewArticleData({
      title: '', content: '', image1: '', image2: '', image3: '', price: '', id_type: '', stock: '', recommandation: 0, color: ''
    });
  };

  const handleSaveNewArticleClick = () => {
    fetch('http://localhost:8000/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newArticleData),
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.text();
      })
      .then(text => {
        const newArticle = JSON.parse(text);
        setArticles([...articles, newArticle]);
        setNewArticleFormVisible(false);
      })
      .catch(error => console.error('Error adding article:', error.message));
  };

  if (!Cookies.get("userId")) {
    return (
      <div>
        <p>Vous n'êtes pas connecté.</p>
      </div>
    );
  }

  const id = {
    id: Cookies.get("userId"),
  };

  fetch("http://localhost:8000/admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(id)
  })
    .then(response => response.json())
    .then(data => {
      setAdmin(data["admin"]);
    });

  if (admin === true) {
    return (
      <div className="dashboard-content">
        
       
        <h1>Articles</h1>
        <table>
          <thead>
            <tr>
              <th>Title Product</th>
              <th>Couleur</th>
              <th>Details</th>
              <th>Image</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article.id}>
                <td>
                  {editingArticle === article.id ? (
                    <input type="text" name="title" value={newArticleData.title} onChange={handleChange} />
                  ) : (
                    article.title
                  )}
                </td>
                <td>
                  {editingArticle === article.id ? (
                    <select value={newArticleData.color} onChange={(e) => handleColorChange(article.id, e)}>
                      {articleColors[article.id] && articleColors[article.id].map((color, index) => (
                        <option key={index} value={color.color}>{color.color}</option>
                      ))}
                    </select>
                  ) : (
                    article.color
                  )}
                </td>
                <td>
                  {editingArticle === article.id ? (
                    <input type="text" name="content" value={newArticleData.content} onChange={handleChange} />
                  ) : (
                    article.content
                  )}
                </td>
                <td>
                  {editingArticle === article.id ? (
                    <div>
                      <input type="text" name="image1" value={newArticleData.image1} onChange={handleChange} placeholder='Image 1 URL' />
                      <input type="text" name="image2" value={newArticleData.image2} onChange={handleChange} placeholder='Image 2 URL' />
                      <input type="text" name="image3" value={newArticleData.image3} onChange={handleChange} placeholder='Image 3 URL' />
                    </div>
                  ) : (
                    <img src={`/assets/${article.image1}`} alt={article.title} />
                  )}
                </td>
                <td>
                  {editingArticle === article.id ? (
                    <input type="number" name="price" value={newArticleData.price} onChange={handleChange} />
                  ) : (
                    article.price
                  )}
                </td>
                <td>
                  {editingArticle === article.id ? (
                    <input type="number" name="stock" value={newArticleData.stock} onChange={handleChange} />
                  ) : (
                    article.stock === 0 ? (
                      <p style={{ color: 'red' }}>Rupture de stock</p>
                    ) : (
                      article.stock < 10 ? (
                        <p style={{ color: 'orange' }}>{article.stock}</p>
                      ) : (
                        <p style={{ color: 'green' }}>{article.stock}</p>
                      )
                    )
                  )}
                </td>
                <td>
                  {editingArticle === article.id ? (
                    <button className="save-btn" onClick={handleSaveClick}>Save</button>
                  ) : (
                    <button className="edit-btn" onClick={() => handleEditClick(article)}>Edit</button>
                  )}
                  <button className="delete-btn" onClick={() => handleDeleteClick(article.id)}>Delete</button>
                  {article.recommandation === 0 ? (
                    <button className="recommand-btn" onClick={() => handleAddrecommandation(article.id)}>Add recommandation</button>
                  ) : (
                    <button className="delete-btn" onClick={() => handleRemoverecommandation(article.id)}>Remove recommandation</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="add-btn" onClick={handleAddArticleClick}>Add New Article</button>

        {newArticleFormVisible && (
          <div className="new-article-form">
            <h2>Add New Article</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newArticleData.title}
              onChange={handleChange}
            />
            <input
              type="text"
              name="content"
              placeholder="Content"
              value={newArticleData.content}
              onChange={handleChange}
            />
            <input
              type="text"
              name="image1"
              placeholder="Image 1 URL"
              value={newArticleData.image1}
              onChange={handleChange}
            />
            <input
              type="text"
              name="image2"
              placeholder="Image 2 URL"
              value={newArticleData.image2}
              onChange={handleChange}
            />
            <input
              type="text"
              name="image3"
              placeholder="Image 3 URL"
              value={newArticleData.image3}
              onChange={handleChange}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newArticleData.price}
              onChange={handleChange}
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={newArticleData.stock}
              onChange={handleChange}
            />
            <input
              type="text"
              name="color"
              placeholder="Couleur"
              value={newArticleData.color}
              onChange={handleChange}
            />
            <select value={newArticleData.color} onChange={handleChange}>
              <option value="">Sélectionner une couleur</option>
              <option value="Red">Rouge</option>
              <option value="Blue">Bleu</option>
              <option value="Green">Vert</option>
            </select>
            <input
              type="number"
              name="id_type"
              placeholder="Type ID"
              value={newArticleData.id_type}
              onChange={handleChange}
            />
            <div className='btn-flex'>
              <button className="save-btn" onClick={handleSaveNewArticleClick}>Save</button>
              <button className="delete-btn" onClick={() => setNewArticleFormVisible(false)}>Cancel</button>
            </div>
          </div>
        )}

      </div>
    );
  } else {
    return (
      <div>
        <p>Vous n'avez pas les permissions pour accéder à cette page.</p>
      </div>
    );
  }
}

export default DashboardContent;