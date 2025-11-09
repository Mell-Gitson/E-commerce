import React from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate} from 'react-router-dom';
import Footer from './components/Footer';
import NavBar from './NavBar';
import Login from './Login';
import SignUp from './SignUp';
import Home from './Home';
import DetailsArticle from './DetailsArticle';
import DashboardContent from './DashboardContent';
import Montres from './Montres';
import Contact from './components/Contact';
import Panier from './Panier.js';
import PanierCommande from './commande.js'
import { useState } from 'react';
import { ConnexionContext } from './ConnexionContext';
import Reduction from './components/Reduction';
import AddColor from './components/AddColor';
import DashboardLayout from './DashboardLayout';
import CategoryManager from './components/CategoryManager';
import UserManager from './UserList';
import Statistics from './Statistics';
import Gift from './Gift';
import DashboardUser from './DashboardUser.js';
import Payment from './Payment.js';
import ArticlesColor from './components/ArticlesColor';
import Cookies from 'js-cookie';
import AdminExcell from './components/AdminExcell';
import Profil from './Profil';


function App() {
  const [isConnected, setIsConnected] = useState(false);

  window.onload = function() {
    window.scrollTo(0, 0);
  };

  const PrivateRoute = ({ children }) => {
    const cart = JSON.parse(localStorage.getItem('cartUnlogged')) || [];
   var total = cart.reduce((acc, item) => acc + item.quantite * item.price, 0);
   if(total > 5000 && isConnected === false){
    return <Navigate to="/login" replace></Navigate>
   }else{
    return <PanierCommande></PanierCommande>
   }
  };
  return (
    <ConnexionContext.Provider value={[isConnected, setIsConnected]}>
      <Router>
        <div>
          <NavBar />

          <Routes>
           
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path={`/article/:id`} element={<DetailsArticle />} />
            <Route path="/montres" element={<Montres />} />
            <Route path="/montres/type/:type" element={<Montres />} />
            <Route path="/montres/marque/:marque" element={<Montres />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/panier" element={<Panier />} />
              <Route path="/panier/commande" element={<PrivateRoute><PanierCommande /></PrivateRoute>}/>
            
           
            <Route path="/dashboard" element={<DashboardUser/>}/>
            <Route path="/payment/:amount" element={<Payment/>}/>
            <Route path="/profil" element={<Profil />} />


            <Route
              path="/admin/*"
              element={
                <DashboardLayout>
                  <Routes>
                    <Route path="category" element={<CategoryManager />} />
                    <Route path="users" element={<UserManager />} />
                    <Route path="articles" element={<DashboardContent />} />
                    <Route path="statistics" element={<Statistics />} />
                    <Route path="gift" element={<Gift />} />
                    <Route path="reduction" element={<Reduction />} />
                    <Route path="AdminExcell" element={<AdminExcell />} />
                    <Route path="articlesColors" element={<ArticlesColor />} />
                    <Route path="color" element={<AddColor />} />


                    

                   
                    
                  </Routes>
                </DashboardLayout>
              }
            />
          </Routes>
        </div>
        <Footer />
      </Router>
    </ConnexionContext.Provider>
  );
}

export default App;