import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Reduction = ({ prix, reduction, onUpdateReduction }) => {
  const [data, setData] = useState([]);
  const [editReduction, setEditReduction] = useState(null);
  const [newReduction, setNewReduction] = useState('');

  function handleEditClick(item) {
    setEditReduction(item.id);
    setNewReduction(item.reduction);
  }

  function handleSaveClick(id) {
    const updatedData = data.map(item => 
      item.id === id ? { ...item, reduction: newReduction } : item
    );
    setData(updatedData);
  
    fetch(`http://localhost:8000/article-colors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reduction: newReduction }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      setEditReduction(null);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  useEffect(() => {
    fetch('http://localhost:8000/article-colors')
      .then(response => response.json())
      .then(data => {
        setData(data);
      });
  }, []);

  useEffect(() => {
    console.log('Data:', data);
  }, [data]);

  return (
    <div>
      <p className='line-through text-gray-500 mb-2'>
        Prix avant : {prix} €
      </p>
      <p className="text-gray-700 text-2xl mb-2">
        Prix : {prix * (1 - reduction / 100)} €
      </p>

      <form className="mt-4">
        <label htmlFor="reduction" className="block mb-2 text-lg">Modifier le taux de réduction :</label>
        <input
          type="number"
          id="reduction"
          className="border rounded-lg p-2 mb-4"
          min="0"
          max="100"
          step="0.01"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">Mettre à jour</button>
      </form>
      <div className="mt-4">
        <h2 className="text-lg mb-2">Liste des articles :</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">prix</th>
              <th className="py-2">Couleur</th>
              <th className="py-2">Réduction </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.price}</td>
                <td className="border px-4 py-2">{item.color}</td>
                <td className="border px-4 py-2">
                  {editReduction === item.id ? (
                    <div>
                      <input 
                        type="number" 
                        value={newReduction} 
                        onChange={(e) => setNewReduction(e.target.value)} 
                        className="border rounded-lg p-2 mb-4"
                      />
                      <button 
                        onClick={() => handleSaveClick(item.id)} 
                        className="bg-blue-500 text-white p-2 rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div>
                      {item.reduction}% 
                      <button 
                        onClick={() => handleEditClick(item)} 
                        className="bg-slate-600 text-white p-2 rounded-lg"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Reduction.propTypes = {
  prix: PropTypes.number.isRequired,
  reduction: PropTypes.number.isRequired,
  onUpdateReduction: PropTypes.func.isRequired,
};

export default Reduction;