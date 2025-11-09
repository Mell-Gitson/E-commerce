import React, { useState, useEffect } from 'react';

const AddColor = () => {
    const [color, setColor] = useState('');
    const [message, setMessage] = useState('');
    const [colors, setColors] = useState([]);

    const handleColorChange = (e) => {
        setColor(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/color', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: color }),
            });

            if (response.ok) {
                setMessage('Couleur ajoutée avec succès');
                fetchColors();
            } else {
                setMessage('Erreur lors de l\'ajout de la couleur');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Erreur lors de l\'ajout de la couleur');
        }
        setColor('');
    };

    const fetchColors = async () => {
        try {
            const response = await fetch('http://localhost:8000/showcolor');
            const data = await response.json();
            setColors(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteColor = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/color/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setMessage('Couleur supprimée avec succès');
                fetchColors();  
            } else {
                setMessage('Erreur lors de la suppression de la couleur');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Erreur lors de la suppression de la couleur');
        }
    };

    useEffect(() => {
        fetchColors();
    }, []);

    return (
        <div>
            <h2>Ajouter une couleur</h2>
            <form className='dark:bg-gray-900 mb-8' onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={color} 
                    onChange={handleColorChange} 
                    placeholder="Entrez la couleur"
                />
                <button type="submit">Ajouter</button>
            </form>
            {message && <p>{message}</p>}

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nom de la couleur
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {colors.length > 0 ? (
                            colors.map((color) => (
                                <tr key={color.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {color.id}
                                    </th>
                                    <td className="px-6 py-4">
                                        {color.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => deleteColor(color.id)} 
                                            className="text-red-500 hover:underline"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center">
                                    Aucune couleur disponible
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            
        </div>
    );
};

export default AddColor;
