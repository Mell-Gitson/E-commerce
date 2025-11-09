import React, { useState, useEffect, useContext } from 'react';
import { ConnexionContext } from './ConnexionContext';
import Cookies from 'js-cookie';
import ArticleCardPanier from './ArticleCardPanier';
import { Link, redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';



const Panier = () => {
  const [panier, setPanier] = useState([]);
  const [cartUnlogged, setCartUnlogged] = useState([]);
  const [isConnected] = useContext(ConnexionContext);
  const [open, setOpen] = useState(false);
  const [openinscription, setOpenInscription] = useState(false);


  const [totalPrice, setTotalprice] = useState(null);
  const [minimumPrice, setMinimumPrice] = useState(false);


  const navRedirect = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCloseIncription = () => setOpenInscription(false);
  const handleOpenIncription = () => setOpenInscription(true);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '900px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleCheckCo = () => {
    if(isConnected){
      navRedirect('/panier/commande');
    }else{
      if(totalPrice > 5000){
      handleOpenIncription();
      }else{
        handleOpen()
      }
    }
  }
  const fetchCartLogged = () => {
    const user_id = Cookies.get("userId");
    const userId = Cookies.get("userId");
    var cartKey = `cart_${userId}`; 
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

      setPanier(cart);
      setTotalprice(cart.reduce((acc, item) => acc + item.quantite * item.price, 0));
      //setTotal(totalPrice);
    // fetch('http://localhost:8000/panier', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ id: user_id }),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log(data); 
    //   setPanier(data);
    // })
    // .catch(error => {
    //   console.error('Erreur:', error);
    // });
  }

  const fetchCartUnlogged = () => {

    // fetch('http://localhost:8000/panier/unlog', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(JSON.parse(localStorage.getItem('cart'))),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log(data); 
    //   // setCartUnlogged(data);
    //   setPanier(data);
    // })
    // .catch(error => {
    //   console.error('Erreur:', error);
    // });


    const cart = JSON.parse(localStorage.getItem('cartUnlogged')) || [];
    setTotalprice(cart.reduce((acc, item) => acc + item.quantite * item.price, 0));
    console.log(cart);
    console.log(cart.reduce((acc, item) => acc + item.quantite * item.price, 0))
    setCartUnlogged(cart);
  }

  const fetchCartItems = () => {
    let cartKey = 'cartUnlogged'; 

    if (isConnected) {
      const userId = Cookies.get("userId");
      cartKey = `cart_${userId}`; 
    }

  }


  useEffect(() => {
    //console.log(localStorage.getItem('cart'))
    if (isConnected) {
      fetchCartLogged()
    } else if (localStorage.getItem('cartUnlogged')) {
      fetchCartUnlogged()
    }
  }, [isConnected]);

  useEffect(() => {
    fetch('http://localhost:8000/getMinimum')
    .then(response => response.json())
    .then(data => {
      setMinimumPrice(data)
    })
    .catch(error => console.error('Error fetching minimum : ', error));
  }, []);


  const handleRemove = (id) => {
    // if (!id) {
    //   console.error('ID manquant pour la suppression');
    //   return;
    // }window.location.reload();

    const user_id = Cookies.get("userId"); 

    // fetch('http://localhost:8000/panier/supprimer', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ id, user_id }), 
    // })
    // .then(response => response.json())
    // .then(data => {
    //   if (!data.error) {
    //     setPanier(panier.filter(article => article.article_id !== id));
    //   } else {
    //     console.error(data.error);
    //   }
    // })
    // .catch(error => {
    //   console.error('Erreur:', error);
    // });

    if (!id) {
      console.error('ID manquant pour la suppression');
      return;
    }
    const oldCart = JSON.parse(localStorage.getItem('cart_' + user_id));
    let newCart = []
    oldCart.forEach((element) => {
      if(element.id !== id){
        newCart = [...newCart, element]
      }
    });
    localStorage.setItem('cart_'+user_id, JSON.stringify(newCart))
    setCartUnlogged(JSON.parse(localStorage.getItem('cart_'+user_id)))
    window.location.reload()
  };

  const handleRemoveUnlogged = (id) => {
    if (!id) {
      console.error('ID manquant pour la suppression');
      return;
    }
    const oldCart = JSON.parse(localStorage.getItem('cartUnlogged'));
    let newCart = []
    oldCart.forEach((element) => {
      if(element.id !== id){
        newCart = [...newCart, element]
      }
    });
    localStorage.setItem('cartUnlogged', JSON.stringify(newCart))
    setCartUnlogged(JSON.parse(localStorage.getItem('cartUnlogged')))
    window.location.reload()
  };

  if(panier.length > 0 && isConnected) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Votre Panier</h1>
        <ul className="space-y-4">
          {panier.map((article, index) => (
            <ArticleCardPanier
              key={index}
              article={article}
              handleRemove={handleRemove}
            />
          ))}
        </ul>
        {totalPrice && totalPrice >= minimumPrice &&
            <div class="mt-8 flex items-center p-4 text-sm text-white border border-white rounded-lg bg-white dark:bg-customGreen dark:text-white" role="alert">
            <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span class="sr-only">Info</span>
            <div>
              <span class="font-medium">Félicitation ! </span> Vous êtes un très bon client, vous recevrez en plus de votre commande un emballage cadeau exclusif.
            </div>
          </div>
        }
        <div className="flex justify-center mt-8">
          <Link to={'/panier/commande'} className="mt-8 bg-black text-white font-medium rounded-lg text-lg px-6 py-3 hover:bg-gray-700 transition duration-200">Passer Commande</Link>
        </div>
      </div>
    );
  } else if (cartUnlogged.length > 0 && !isConnected){
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Votre Panier</h1>
        <ul className="space-y-4">
          {cartUnlogged.map((article, index) => (
            <ArticleCardPanier
              key={index}
              article={article}
              handleRemove={handleRemoveUnlogged}
            />
          ))}
        </ul>
        {totalPrice && totalPrice >= minimumPrice &&
            <div class="mt-8 flex items-center p-4 text-sm text-white border border-white rounded-lg bg-white dark:bg-customGreen dark:text-white" role="alert">
            <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span class="sr-only">Info</span>
            <div>
              <span class="font-medium">Félicitation ! </span> Vous êtes un très bon client, vous recevrez en plus de votre commande un emballage cadeau exclusif.
            </div>
          </div>
        }
        <button onClick={handleCheckCo}className="mt-8 bg-black text-white font-medium rounded-lg text-lg px-6 py-3 hover:bg-gray-700 transition duration-200">Passer Commande</button>


        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto" sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" className='text-center'>
                Pas encore inscris ?
              </Typography>
              <div className='text-center'>
              <button onClick={() => {navRedirect("/signup")}} className="mt-8 bg-green-700	 text-white font-medium rounded-lg text-lg px-6 py-3 hover:bg-gray-700 transition duration-200">Oui, je veux m'inscrire</button>
              <button onClick={() => {navRedirect("/panier/commande")}} className="mt-8 bg-red-700 text-white font-medium rounded-lg text-lg px-6 py-3 hover:bg-gray-700 transition duration-200">Non, je souhaite poursuivre</button>
              </div>
            </Box>
          </Modal>


          <Modal
            open={openinscription}
            onClose={handleCloseIncription}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto" sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" className='text-center'>
                Votre Panier à un montant trop élevé, vous devez vous inscrire..
              </Typography>
              <div className='text-center'>
              <button onClick={() => {navRedirect("/signup")}} className="mt-8 bg-green-700	 text-white font-medium rounded-lg text-lg px-6 py-3 hover:bg-gray-700 transition duration-200">Ok chef</button>
              </div>
            </Box>
          </Modal>
      </div>
      
    );
  } else {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Votre Panier</h1>
        <p className="text-gray-500">Votre panier est vide.</p>
        
      </div>
      
    );
  }
  
}

export default Panier;

