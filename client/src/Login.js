import React, { useContext } from 'react';
import './Formulaire.css';
import Cookies from 'js-cookie';
import { ConnexionContext } from './ConnexionContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isConnected, setIsConnected] = useContext(ConnexionContext);
  const navRedirect = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    const userLogs = {
      email: new FormData(e.target).get("email"),
      pass: new FormData(e.target).get("pass"),
    };

    console.log(userLogs);

    fetch("http://localhost:8000/connexion", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(userLogs)
    })
    .then(response => response.json())
    .then(data => {
     // console.log(data)
      if (data["connexion"] === true) {
        Cookies.set('userId', data.id, { expires: 1/24 }); 
        // Cookies.set('isAdmin', data.admin ? '1' : '0', { expires: 1/24 }); 
        if(data.admin === "1") Cookies.set("isAdmin", true, { expires: 1/24 })
        else Cookies.set("isAdmin", false, { expires: 1/24 })
        setIsConnected(true);
        alert("Vous êtes connecté");
        console.log(data.id);
        navRedirect('/');
      } else {
        alert("La connexion a échoué");
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  return (
    <div>
      <form className=' mt-24' onSubmit={handleLogin}>

        <label htmlFor="email"> Email: </label>
        <input className='focus:border-gray-500 focus:outline-none' type="text" id="email" name="email" required /><br />
        <label htmlFor="pass">Mot de passe: </label>
        <input className='focus:outline-none' type="password" id="pass" name="pass" required /><br />
        <button className='btn-send mt-4 mb-8'>Connexion</button>
        
        <p className='text-sm justify-end ml-24'>? Mot de passe oublié</p>
      </form>
    </div>
  );
}

export default Login;
