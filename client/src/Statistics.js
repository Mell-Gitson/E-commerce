import React, { useState, useEffect } from 'react';
import './Statistics.css';

function Statistics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://api.goshippo.com/v1/shipments/', {
          method: 'GET',
          headers: {
            'Authorization': 'ShippoToken shippo_test_963e401ee4115d95511dec754cf2f3a349e00f3c',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`API error occurred: Status ${response.status} Content-Type ${response.headers.get('Content-Type')} Body ${await response.text()}`);
        }

        const shipments = await response.json();
        console.log(shipments);

        //  // Traitement des données // //
        const formattedData = shipments.results.map((shipment) => {
          const addressTo = shipment.address_to;
          const rate = shipment.rates[0]; 

          return {
            country: addressTo.country,
            city: addressTo.city,
            distance: calculateDistance(shipment), 
            price: rate ? parseFloat(rate.amount) : 'N/A' 
          };
        });

        setData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données Shippo:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateDistance = (shipment) => {
    return Math.floor(Math.random() * 2000) + 1;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="shipment-container">
    <div className="shipment-table whitelist-table">
      <h2 className="whithi">Whitelist (Courte Distance)</h2>
      <ul className="shipment-list">
        {data
          .filter((item) => item.distance <= 1000)
          .map((item, index) => (
            <li key={index} className="shipment-item whitelist">
              <div className="shipment-detail"><strong>Country:</strong> {item.country}</div>
              <div className="shipment-detail"><strong>City:</strong> {item.city}</div>
              <div className="shipment-detail"><strong>Distance:</strong> {item.distance} km</div>
              <div className="shipment-detail"><strong>Price:</strong> {item.price} $</div>
            </li>
          ))}
      </ul>
    </div>
  
    <div className="shipment-table blacklist-table">
      <h2 className="blacki">Blacklist (Longue Distance)</h2>
      <ul className="shipment-list">
        {data
          .filter((item) => item.distance > 1000)
          .map((item, index) => (
            <li key={index} className="shipment-item blacklist">
              <div className="shipment-detail"><strong>Country:</strong> {item.country}</div>
              <div className="shipment-detail"><strong>City:</strong> {item.city}</div>
              <div className="shipment-detail"><strong>Distance:</strong> {item.distance} km</div>
              <div className="shipment-detail"><strong>Price:</strong> {item.price} $</div>
            </li>
          ))}
      </ul>
    </div>
  </div>
  );
}

export default Statistics;