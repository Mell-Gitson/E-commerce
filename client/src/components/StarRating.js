import React, { useState, useContext } from 'react';
import { ConnexionContext } from '../ConnexionContext';
import Cookies from 'js-cookie';

const Modal = ({ show, onClose, onSubmit }) => {
    const [comment, setComment] = useState('');

    if (!show) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(comment);
        setComment('');
    };

    return (
        <div className=" relative inset-0 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-11/12 md:w-9/12 lg:w-1/2 transform transition-all duration-300 hover:scale-105">
                <h2 className="flex justify-center font-semibold text-xl mb-4">Ajouter un commentaire</h2>
                <form  className='bg-white shadow-md' onSubmit={handleSubmit}>
                    <textarea
                        className="w-full p-2 border z-20 border-gray-300 rounded mb-4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Votre commentaire"
                        required
                    />
                    <div className="flex flex-col sm:flex-row justify-center  w-full">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="w-full m-auto sm:w-auto mb-1 bg-red-600 hover:bg-red-500 text-white rounded transform transition-all duration-300 hover:scale-105">
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            className="w-full sm:w-auto m-auto mb-1 bg-gray-700 hover:bg-gray-500 text-white rounded transform transition-all duration-300 hover:scale-105">
                            Soumettre
                        </button>
                        
                    </div>

                </form>
            </div>
        </div>
    );
};

const StarRating = ({ rating, onRatingChange,color }) => {
    const [hover, setHover] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedRating, setSelectedRating] = useState(null);
    const userId = Cookies.get("userId");
    const user = useContext(ConnexionContext);

    const handleRatingChange = (ratingValue) => {
        console.log(color.selectedColor)
        setSelectedRating(ratingValue);
        setShowModal(true);
    };

    const handleModalSubmit = async (comment) => {
        try {
            console.log('ID de l\'utilisateur connecté:', userId); 

            console.log(userId)
            const response = await fetch('http://localhost:8000/avis/add', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notes: selectedRating, commentaire: comment, user_id: userId, article_id: color.selectedColor.id }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi de la note');
            }

            const data = await response.json();
            console.log('Réponse du serveur:', data);
            onRatingChange(selectedRating);
            setShowModal(false);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    return (
        <div>
            <div className="star-rating flex text-white bg-white w-40">
                {[...Array(5)].map((star, index) => {
                    const ratingValue = index + 1;

                    return (
                        <label key={index}>
                            <input
                                type="radio"
                                name="rating"
                                value={ratingValue}
                                onClick={() => handleRatingChange(ratingValue)}
                                className="hidden"
                            />
                            <svg
                                className={`w-8 h-8 cursor-pointer flex ${
                                    ratingValue <= (hover || rating) ? 'text-yellow-300' : 'text-gray-300'
                                }`}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(null)}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.392-2.46a1 1 0 00-1.176 0l-3.392 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.245 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                            </svg>
                        </label>
                    );
                })}
            </div>
            <Modal className='' show={showModal} onClose={() => setShowModal(false)} onSubmit={handleModalSubmit} />
        </div>
    );
};

export default StarRating;
