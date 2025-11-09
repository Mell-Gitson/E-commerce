import React, { useState, useEffect } from 'react';

function Gift() {
  const [minimum, setMinimum] = useState([]);

  const handleChangeMinimum = (e) => {
    e.preventDefault();
    setMinimum(e.target.value);
  }

  const getMinimum = (e) => {
    e.preventDefault();
    fetch('https://localhost:8000/setMinimum', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(minimum),
    })
    .then(() => {
      alert("Modification enregistrée")
    })
    .catch(error => {
      console.error('Erreur : ', error);
    });
  }

  return (
    <div className="">
      <form onSubmit={getMinimum}>
        <label htmlFor='minimum'>Panier minimum en euro pour l'emballage cadeau : </label>
        <input 
          onChange={handleChangeMinimum} 
          type="number" 
          name="minimum" 
          placeholder='5000' 
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input type='submit' value="Valider"/>
      </form>
    </div>
  );
}

export default Gift;