import React, { useState } from 'react';

const AddArticleColor = () => {
  const [formData, setFormData] = useState({
    article_id: '',
    price: '',
    image1: '',
    image2: '',
    image3: '',
    color_id: '',
    reduction: '',
    nouveaute: '',
    notes: '',
    stock: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/articlesColor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Article added successfully!');
        setFormData({
          article_id: '',
          price: '',
          image1: '',
          image2: '',
          image3: '',
          color_id: '',
          reduction: '',
          nouveaute: '',
          notes: '',
          stock: ''
        });
      } else {
        alert('Error adding article');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding article');
    }
  };

  return (
    <div>
      <h2>Add New Article</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Article ID:
          <input type="text" name="article_id" value={formData.article_id} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Price:
          <input type="text" name="price" value={formData.price} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Image 1:
          <input type="text" name="image1" value={formData.image1} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Image 2:
          <input type="text" name="image2" value={formData.image2} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Image 3:
          <input type="text" name="image3" value={formData.image3} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Color ID:
          <input type="text" name="color_id" value={formData.color_id} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Reduction:
          <input type="text" name="reduction" value={formData.reduction} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Nouveaute:
          <input type="text" name="nouveaute" value={formData.nouveaute} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Notes:
          <input type="text" name="notes" value={formData.notes} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Stock:
          <input type="text" name="stock" value={formData.stock} onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">Add Article</button>
      </form>
    </div>
  );
};

export default AddArticleColor;
