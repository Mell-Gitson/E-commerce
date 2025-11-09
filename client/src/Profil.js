import React, { useState, useEffect, useContext } from 'react';
import { ConnexionContext } from './ConnexionContext';
import Cookies from 'js-cookie';

function Profil() {
  const [userData, setUserData] = useState({
    lastname: '',
    firstname: '',
    email: '',
    password: '',
    address: '',
    city: '',
    zipcode: '',
    country: '',
    cards: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useContext(ConnexionContext);

  useEffect(() => {
    const userId = Cookies.get('userId');
    if (userId) {
      fetch(`http://localhost:8000/api/user/${userId}`)
        .then(response => response.json())
        .then(data => {
          setUserData({
            lastname: data.lastname,
            firstname: data.firstname,
            email: data.email,
            password: '', 
            address: data.address || '',
            city: data.city || '',
            zipcode: data.zipcode || '',
            country: data.country || '',
            cards: data.cards || [],
          });
        })
        .catch(error => {
          console.error('Erreur lors du chargement des données utilisateur:', error);
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };


    let buttonText;
    let buttonClass;

    if (isEditing) {
      buttonText = 'Fermer';
       buttonClass = 'bg-red-500 hover:bg-red-600';
    } else {
     buttonText = 'Modifier vos informations';
      buttonClass = 'bg-gray-500 hover:bg-gray-600';
    }

    
  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = Cookies.get('userId');

    const updatedData = { ...userData };
    if (updatedData.password === '') {
      delete updatedData.password;
    }

    fetch(`http://localhost:8000/api/user/${userId}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setMessage('Vos informations ont été mises à jour avec succès.');
      } else {
        setMessage('Erreur lors de la mise à jour de vos informations.');
      }
    })
    .catch(error => {
      console.error('Erreur lors de la mise à jour des informations:', error);
      setMessage('Erreur lors de la mise à jour de vos informations.');
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Mon Profil</h2>

      <button
    onClick={() => setIsEditing(!isEditing)}
    className={`transform transition-all duration-300 hover:scale-105 mb-6 px-6 py-2 rounded-lg text-white ${buttonClass}`}
  >
    {buttonText}
  </button>

      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white">
          <div>
            <label htmlFor="lastname" className="block text-md font-medium text-gray-700">Nom</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={userData.lastname}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          <div>
            <label htmlFor="firstname" className="block text-md font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={userData.firstname}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-md font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-md font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Laissez vide si vous ne souhaitez pas changer de mot de passe"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-md font-medium text-gray-700">Adresse</label>
            <input
              type="text"
              id="address"
              name="address"
              value={userData.address}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-md font-medium text-gray-700">Ville</label>
            <input
              type="text"
              id="city"
              name="city"
              value={userData.city}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          <div>
            <label htmlFor="zipcode" className="block text-md font-medium text-gray-700">Code postal</label>
            <input
              type="text"
              id="zipcode"
              name="zipcode"
              value={userData.zipcode}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-md font-medium text-gray-700">Pays</label>
            <input
              type="text"
              id="country"
              name="country"
              value={userData.country}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Mettre à jour
          </button>
        </form>
      )}

      <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Adresse enregistrée</h3>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <p>{userData.address}, {userData.city}, {userData.zipcode}, {userData.country}</p>
      </div>

      <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Cartes bancaires enregistrées</h3>
      {userData.cards.map((card, index) => (
        <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4">
          <p>**** **** **** {card.last4}</p>
        </div>
      ))}

      <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Suivi des livraisons</h3>
      <div className="bg-gray-100 p-4 rounded-lg">
        <p>Aucune livraison en cours</p>
      </div>

      {message && <p className="mt-6 text-center font-semibold text-red-500">{message}</p>}
    </div>
  );
}

export default Profil;
