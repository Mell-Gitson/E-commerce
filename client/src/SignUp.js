import React from 'react';
import './Formulaire.css';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navRedirect = useNavigate();

  function handleSignUp(e) {
    e.preventDefault();
    const userInfos = {
      email: new FormData(e.target).get("email"),
      pass: new FormData(e.target).get("pass"),
      lastname: new FormData(e.target).get("lastname"),
      firstname: new FormData(e.target).get("firstname"),
      admin: 0
    };

    console.log(userInfos);

    fetch("http://localhost:8000/api", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(userInfos)
    })
    .then(response => response.json()).then(data => {
      if(data.inscription === false){
        alert("L'adresse email est déja utilisée")
      } else {
        alert("Inscription réussie")
        navRedirect('/login');
      }
    })
  }

  return (
    <form onSubmit={handleSignUp}>
      <label htmlFor="lastname">Enter your lastname: </label>
      <input type="text" id="lastname" name="lastname"></input><br/>
      <label htmlFor="firstname">Enter your firstname: </label>
      <input type="text" id="firstname" name="firstname"></input><br/>
      <label htmlFor="email">Enter your mail address: </label>
      <input type="text" id="email" name="email"></input><br/>
      <label htmlFor="pass">Enter your password: </label>
      <input type="text" id="pass" name="pass"></input><br/>
      <button className='btn-send'>Send</button>
    </form>
  );
}

export default SignUp;
