import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import Modal from 'react-modal';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import './App.css';
import { ConnexionContext } from './ConnexionContext';
import StarRating from './components/StarRating';

Modal.setAppElement('#root');

const DetailsArticle = () => {
    const { id } = useParams();
    const [articleDetails, setArticleDetails] = useState(null);
    const [articleColors, setArticleColors] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [selectImage, setSelectImage] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [isConnected] = useContext(ConnexionContext);

    console.log('articleColors', articleColors);

    const options = [];
    const [quantite, setQuantite] = useState(1);

    const [avis, setAvis] = useState([])

    const changeQuantite = (e) => {
        setQuantite(parseInt(e.target.value));
    }
    
    const changeColor = (e) => {
        const color = articleColors.find(ac => ac.color === e.target.value);
        if (color) {
            setSelectedColor(color);
            console.log('Selected Color:', color); 
        } else {
            console.error('Couleur non trouvée:', e.target.value);
        }
    };

    useEffect(() => {
        if (selectedColor) {
            console.log('Selected color stock:', selectedColor.stock);
            fetch("http://localhost:8000/avis", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({article_id: selectedColor.id})
            })
            .then((response) => response.json())
            .then((data) => setAvis(data))
        }
    }, [selectedColor]);

    const AlertStockIndisponible = () => {
        Swal.fire({
            icon: 'error',
            title: 'Stock indisponible',
            text: 'Cet article est actuellement en rupture de stock',
            confirmButtonText: 'Ok',
            customClass: {
                popup: 'styled-alert',
                title: 'styled-title',
                confirmButton: 'styled-button'
            }
        });
    };

    const handleAddToCart = () => {
        if(selectedColor.stock <= 0){
            AlertStockIndisponible();
        } else {
            const userId = Cookies.get("userId");

            if (!selectedColor || !selectedColor.id || !quantite || (isConnected && !userId)) {
                console.error('Missing data', { selectedColor, quantite, user_id: userId });
                return;
            }

            const cartItem = {
                id: id,
                articleColorId: selectedColor.id,
                quantite: quantite,
                title: articleDetails.title,
                price: selectedColor.price,
                image: selectedColor.image1,
                color: selectedColor.color,
                reduction: selectedColor.reduction,
                stock: selectedColor.stock
            };

            let cartKey = 'cartUnlogged'; 

            if (isConnected) {
                cartItem.user_id = userId;
                cartKey = `cart_${userId}`; 
            }

            let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

            const existingItemIndex = cart.findIndex(item => item.articleColorId === cartItem.articleColorId);

            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantite += quantite;
            } else {
                cart.push(cartItem);
            }

            localStorage.setItem(cartKey, JSON.stringify(cart));

            console.log(`Cart updated in localStorage under key ${cartKey}:`, cart);

            Swal.fire({
                icon: "success",
                title: "Article ajouté au panier",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.reload(); 
            });
        }
    };

    useEffect(() => {
        fetch(`http://localhost:8000/api/articles/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setArticleDetails(data);
                setChargement(false);
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des détails de l\'article:', error);
                setChargement(false);
            });

        fetch(`http://localhost:8000/api/articles/${id}/colors`)
            .then((response) => response.json())
            .then((data) => {
                setArticleColors(data);
                if (data.length > 0) {
                    setSelectedColor(data[0]); 
                }
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des couleurs de l\'article:', error);
            });

            if(!selectedColor){
                fetch("http://localhost:8000/avis", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                      },
                    body: JSON.stringify({article_id: id})
                })
                .then((response) => response.json())
                .then((data) => console.log(data))
            }
    }, [id]);

    if (chargement) {
        return <div>Chargement...</div>;
    }

    if (!articleDetails) {
        return <div>Cet article n'existe pas, désolé</div>;
    }

    const handleImageClick = (index) => {
        setSelectImage(index);
    };

    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            setSelectImage(null);
        }
    };

    const images = selectedColor ? [selectedColor.image1, selectedColor.image2, selectedColor.image3] : [
        articleDetails.image,
        articleDetails.image2,
        articleDetails.image3,
    ];

    for(let i = 1; i <= articleDetails.stock; i++){
        options.push(i);
    }

    const prixAvantReduction = selectedColor ? selectedColor.price : articleDetails.price;
    const stock = selectedColor ? selectedColor.stock : articleDetails.stock;

    const prixAffiche = selectedColor && selectedColor.reduction 
        ? (selectedColor.price * (1 - selectedColor.reduction / 100)).toFixed(2) 
        : parseFloat(articleDetails.price).toFixed(2);

    return (
        <div className='mb-16'>
            <div className="mt-8 shadow-xl rounded-xl max-w-6xl mx-auto p-6 mb-2 border-black transform transition-transform hover:scale-105 duration-500">
                <p className='underline underline-offset-4'>
                    <Link to={`/montres/type/${articleDetails.type}`}>{articleDetails.type}</Link>/
                    <Link to={`/montres/marque/${articleDetails.marque}`}>{articleDetails.marque}</Link>
                </p>
                <h1 className="text-center font-bold text-6xl mb-20 transform transition-transform hover:scale-105 duration-500">{articleDetails.title}</h1>
                
                {selectedColor && selectedColor.reduction > 0 && (
                    <p className="text-red-500 font-bold text-xl mb-4">Article en réduction - {selectedColor.reduction}% !</p>
                )}

                {selectedColor && selectedColor.nouveaute > 0 && (
                    <p className="text-black font-bold text-xl mb-4">Nouveauté !</p>
                )}

                <StarRating className=''color={{selectedColor}} />

                <div className="p-10 flex flex-col lg:flex-row ">
                    <div className="lg:w-1/2 flex flex-col items-center">
                        <img
                            className="w-full rounded-xl border p-4 bg-white shadow-md cursor-pointer mb-4 transform transition-transform hover:scale-105 duration-500"
                            src={`/assets/${images[0]}`}
                            alt="principale"
                            onClick={() => handleImageClick(0)}
                            style={{ width: '600px', height: '400px', objectFit: 'cover' }}
                        />
                        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 transform transition-transform hover:scale-105 duration-500">
                            {images.map((image, index) => (
                                <img
                                    key={index}
                                    className="border rounded-xl shadow-md cursor-pointer"
                                    src={`/assets/${image}`}
                                    alt={`image${index}`}
                                    onClick={() => handleImageClick(index)}
                                    style={{ width: '150px', height: '100px', objectFit: 'cover' }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 flex flex-col items-center lg:items-start p-20">
                        <p className="shadow-sm opacity-50 hover:opacity-60 shadow-black bg-white text-lg font-semibold mb-6 text-center lg:text-left rounded-lg p-2 transform transition-transform hover:scale-105 duration-500">
                            {articleDetails.content}
                        </p>
                        
                        <div className="text-center lg:text-left mt-6">
                            <p className='line-through text-gray-500 mb-2'>
                                Prix avant : {prixAvantReduction}€
                            </p>
                            <p className="text-gray-700 text-2xl mb-2">
                                Prix : {prixAffiche} €
                            </p>                       
                            <p className="mt-2 mb-2 w-32 text-center p-2 bg-red-600 text-white mx-auto lg:mx-0">
                                {articleDetails.marque}
                            </p>
                            <p className="text-gray-700 text-2xl mb-4">Stock : {stock}</p>

                            <label htmlFor="color-select" className="block mb-2 text-lg">Couleur :</label>
                            <select id="color-select" onChange={changeColor} className="mb-4 border rounded-lg p-2">
                                {articleColors.map((color, index) => (
                                    <option key={index} value={color.color}>{color.color}</option>
                                ))}
                            </select>

                            <label htmlFor="quantity-select" className="block mb-2 text-lg">Quantité :</label>
                            <select id="quantity-select" onChange={changeQuantite} className="mb-4 border rounded-lg p-2">
                                {options.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>

                            <button 
                                className="mt-4 mb-4 bg-black text-white font-medium rounded-lg text-sm px-5 py-2.5 transform transition-transform hover:scale-105 duration-500" 
                                onClick={handleAddToCart}>
                                Ajouter au panier
                            </button>
                        </div>
                    </div>
                </div>
                    <div className=' divide-y divide-slate-700 mx-auto justify-center text-center border-t-2 w-full border-black'>
                        <h1 className=' border-b-2 bg-gray-200 border-black'>Avis sur le produit</h1>
                        
                        {console.log(avis.note)}
                        
                        {avis.map((comment,index) => (
                            <div className=' border-black mt-4 flex text-center'>
                                
                             {[...Array(5)].map((value,index) => (
                                    parseInt(index + 1, 10) <= comment.note? 
                                        <svg
                                            className={`w-8 hover:opacity-40 hover:cursor-pointer h-8 flex z`}
                                            fill="yellow"
                                            index={index +1}
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.392-2.46a1 1 0 00-1.176 0l-3.392 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.245 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                                        </svg>
                                     : 
                                        
                                        <svg
                                        className={`w-8 h-8 flex`}
                                        fill="white"
                                        index={index +1 }
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.392-2.46a1 1 0 00-1.176 0l-3.392 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.245 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                                    </svg>
                                   
                                    
                                          
                        ))}  
                           
                           
                            <p className='mb-2 w-40 ml-2  text-center h-6 justify-center'>From : {comment.firstname}</p>
                            <p className=''><br />{comment.commentaire}</p>
                           
                    </div>
                    
                        ))}
                    </div>
                <Modal
                    isOpen={selectImage !== null}
                    onRequestClose={handleCloseModal}
                    contentLabel="Image Modal"
                    className="flex justify-center items-center w-full h-full"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center"
                    onClick={handleCloseModal}>
                    <div className="relative flex justify-center items-center w-full h-full">
                        <button
                            className="absolute top-4 left-4 text-white text-2xl font-bold"
                            onClick={handleCloseModal}>
                            x
                        </button>
                        <Carousel
                            selectedItem={selectImage}
                            showThumbs={false}
                            showStatus={false}
                            onChange={(index) => setSelectImage(index)}
                            className="w-11/12 h-11/12">
                            {images.map((image, index) => (
                                <div key={index}>
                                    <img
                                        className="object-contain"
                                        style={{ height: '90vh', width: '90vw' }}
                                        src={`/assets/${image}`}
                                        alt={`image${index}`}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default DetailsArticle;