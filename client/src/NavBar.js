import React, { useState, useContext, useEffect } from 'react';
import './NavBar.css';
import { ConnexionContext } from './ConnexionContext';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import { FaUser, FaHome, FaClock, FaPhone, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUserShield, FaShoppingCart } from 'react-icons/fa';
import { GiCardboardBoxClosed } from "react-icons/gi";


function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useContext(ConnexionContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [marques, setMarques] = useState([]);
  const [types, setTypes] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartItemsUnlogged, setCartItemsUnlogged] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalUnlogged, setTotalUnlogged] = useState(0);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const fetchCartItems = () => {
    let cartKey = 'cartUnlogged'; 

    if (isConnected) {
      const userId = Cookies.get("userId");
      cartKey = `cart_${userId}`; 
    }

    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (isConnected) {
      setCartItems(cart);
      const totalPrice = cart.reduce((acc, item) => {
        const priceAfterReduction = item.reduction 
          ? item.price * (1 - item.reduction / 100) 
          : item.price;
        return acc + item.quantite * priceAfterReduction;
      }, 0);      
      setTotal(totalPrice);
    } else {
      setCartItemsUnlogged(cart);
      const totalPriceUnlogged = cart.reduce((acc, item) => {
        const priceAfterReduction = item.reduction 
          ? item.price * (1 - item.reduction / 100) 
          : item.price;
        return acc + item.quantite * priceAfterReduction;
      }, 0);
      setTotalUnlogged(totalPriceUnlogged);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [isConnected]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setIsConnected(false);
    Cookies.remove('userId');
    Cookies.remove('isAdmin');
  };

  useEffect(() => {
    if (Cookies.get('isAdmin') && Cookies.get('isAdmin') === "true") setIsAdmin(true);
    else setIsAdmin(false);
    if (Cookies.get("userId")) setIsConnected(true);
  }, [isConnected]);

  useEffect(() => {
    fetch('http://localhost:8000/allMarque')
      .then(response => response.json())
      .then(data => setMarques(data));

    fetch('http://localhost:8000/allType')
      .then(response => response.json())
      .then(data => setTypes(data));
  }, []);

  return (
    <nav className="text-black mt-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="text-black text-lg font-bold mr-4">
        </div>
        <div className="flex lg:hidden">
          <button
            className="text-black"
            onClick={toggleMenu}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        <div className={`nav-container ${isOpen ? 'block' : 'hidden'} lg:flex lg:items-center lg:w-auto order-2 lg:order-3`}>
          <ul className={`nav-items ${isOpen ? 'mobile' : ''} flex flex-col lg:flex-row list-none lg:space-x-4 lg:ml-auto`}>
            <div className='pos'>
              <li><Link to="/" className="hoverbutton   navbar-button  transform transition-all duration-300 hover:scale-105"><FaHome className=" iconeelement inline-block mr-2 md:text-black sm:text-black" />Accueil</Link></li>
              <li className="relative group">
                <Link to="/montres" className="hoverbutton navbar-button  transform transition-all duration-300 hover:scale-105"><FaClock className="inline-block mr-2" />Montres</Link>
                <div className="absolute hidden bg-white text-black group-hover:block w-96 p-4 shadow-lg left-1/2 transform -translate-x-1/2 z-50">
                  <div className="flex text-center">
                    <div className="w-1/2">
                      <h3 className="px-4 py-2 font-bold justify-center">Marques</h3>
                      <ul>
                        {marques.map((marque) => (
                          <li key={marque.id} className="px-4 py-2 hover:bg-customGreen hover:text-white"><Link to={`/montres/marque/${marque.name}`}>{marque.name}</Link></li>
                        ))}
                      </ul>
                    </div>
                    <div className="w-1/2">
                      <h3 className="px-4 py-2 font-bold">Catégories</h3>
                      <ul>
                        {types.map((type) => (
                          <li key={type.id} className="px-4 py-2 hover:bg-customGreen hover:text-white"><Link to={`/montres/type/${type.name}`}>{type.name}</Link></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
              <li><Link to="/contact" className="navbar-button  transform transition-all duration-300 hover:scale-105 hoverbutton"><FaPhone className="inline-block mr-2" />Contact</Link></li>
              <li><Link to="/dashboard" className="navbar-button  transform transition-all duration-300 hover:scale-105 hoverbutton"><GiCardboardBoxClosed className="inline-block mr-2"/>Mes Commandes</Link></li>
              <li className='flex md:justify-center  transform transition-all duration-300 hover:scale-105 z-10'> <SearchBar /> </li>
            </div>
            <Link to="/">
              <img src="/assets/1.png" alt="Logo" className=" h-24 w-48 navlogo flex-shrink-0" />
            </Link>
            {isConnected ? (
              <>
                <li
                  className="custom-navbar-button hoverbutton"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link to="/panier" className="custom-link relative">
                    <FaShoppingCart className="inline-block mr-2" />
                    Panier
                    {cartItems.length > 0 && (
                      <span className="cart-counter">{cartItems.length}</span>
                    )}
                  </Link>
                  {isHovered && (
                    <div className="custom-dropdown-menu ">
                      <ul>
                        {cartItems.length > 0 ? (
                          cartItems.map(item => (
                            <li key={item.article_id} className="dropdown-item">
                              <img src={`/assets/${item.image}`} alt={item.title} className=" item-image" />
                              <div className="item-details">
                                <div>{item.title}</div>
                                <div>Quantité : {item.quantite}</div>
                                <div>Prix : {(item.price * (1 - item.reduction / 100)).toFixed(2)}€</div>
                                <div><Link to="/panier" className="view-more-link">Voir plus</Link></div>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="dropdown-item">Votre panier est vide.</li>
                        )}
                      </ul>
                      <div>Total : {total}€</div>
                    </div>
                  )}
                </li>
                {isAdmin && (
                  <li><Link to="/admin" className="navbar-button  transform transition-all duration-300 hover:scale-105"><FaUserShield className="inline-block mr-2" />Admin</Link></li>
                )}
                <li><Link to="/profil" className="navbar-button  transform transition-all duration-300 hover:scale-105 hoverbutton"><FaUser className="inline-block mr-2" />Profil</Link></li>
                <li className="navbar-button  transform transition-all duration-300 hover:scale-105 hoverbutton" onClick={handleLogout}><FaSignOutAlt className=" inline-block mr-2" />Déconnexion</li>
              </>
            ) : (
              <>
                {cartItemsUnlogged.length > 0 && (
                  <li
                    className="custom-navbar-button"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to="/panier" className="custom-link relative  transform transition-all duration-300 hover:scale-105">
                      <FaShoppingCart className="inline-block mr-2" />
                      Panier
                      <span className="cart-counter">{cartItemsUnlogged.length}</span>
                    </Link>
                    {isHovered && (
                      <div className="custom-dropdown-menu">
                        <ul>
                          {cartItemsUnlogged.map(item => (
                            <li key={item.articleColorId} className="dropdown-item">
                              <img src={`/assets/${item.image}`} alt={item.title} className="item-image " />
                              <div className="item-details">
                                <div>{item.title}</div>
                                <div>Quantité : {item.quantite}</div>
                                <div>Prix : {(item.price * (1 - item.reduction / 100)).toFixed(2) }€</div>
                                {/* {console.log('Item' + item.reduction)} */}
                                <div><Link to="/panier" className="view-more-link">Voir plus</Link></div>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div>Total : {totalUnlogged}€</div>
                        <div className="text-center mt-2">
                          <Link to="/panier" className="view-more-link">Voir le panier</Link>
                        </div>
                      </div>
                    )}
                  </li>
                )}
                <li><Link to="/login" className="navbar-button  transform transition-all duration-300 hover:scale-105"><FaSignInAlt className="inline-block mr-2" />Connexion</Link></li>
                <li><Link to="/signup" className="navbar-button  transform transition-all duration-300 hover:scale-105"><FaUserPlus className="inline-block mr-2" />S'inscrire</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
