import React, { useEffect, useContext, useState } from 'react';
import './Formulaire.css';
import { useNavigate } from 'react-router-dom';
import { ConnexionContext } from './ConnexionContext';
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';

function DashboardUser() {
    const [isConnected] = useContext(ConnexionContext);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (isConnected) {
            const user_id = Cookies.get("userId");

            fetch("http://localhost:8000/commande", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: user_id })
            })
                .then((response) => response.json())
                .then((data) =>
                    setData(data)
                );

        } else {
            for (var i = 0; i < localStorage.length; i++) {
                if (localStorage.getItem("commande_" + i) !== null) {
                    var commande = localStorage.getItem("commande_" + i);
                    setData(prevData => [...prevData, JSON.parse(commande)]);
                }
            }

        }
    }, [isConnected]);

    const generatePDF = (item) => {
        const doc = new jsPDF();
        doc.text("Détails de la Commande", 10, 10);
        doc.text(`Numéro de Commande: ${item.command_number}`, 10, 20);
        doc.text(`Numéro de suivi: ${item.tracking_number}`, 10, 30);
        
        doc.save(`commande_${item.command_number}.pdf`);
    };

    return (
        <div>
            <h1>Vos Commandes</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Numéro de Commande</th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Numéro de suivi</th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 border-b border-gray-200">{item.command_number}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{item.tracking_number}</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                                <button className='px-2 py-1 bg-blue-500 text-white rounded' onClick={() => generatePDF(item)}>Télécharger en PDF</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DashboardUser;