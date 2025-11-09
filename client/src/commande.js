import React, {useEffect, useState,useContext} from 'react';
import './Formulaire.css';
// import { useNavigate } from 'react-router-dom';
import { Shippo } from "shippo";
import { ConnexionContext } from './ConnexionContext';

import Cookies from 'js-cookie';
import ArticleCardPanier from './ArticleCardPanier';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Swal from 'sweetalert2';
import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



function Commande() {
    const [countries, setCountries] = useState([]);
    const [north, setNorth] = useState([]);
    const user_id = Cookies.get("userId");
    const [information, setInformation] = useState({lastname: '', firstname: '', email: '',adress: '',city: '',zipcode: '',country: '',id: user_id});
    const [codeCountry, setcodecountry] = useState();
    const [priceExpedition, setPriceExpedition] = useState(0);
    const [panier, setPanier] = useState([]);
    const [open, setOpen] = useState(false);
    const [total, setTotal] = useState(0);
    const [rates, setRates] = useState(null);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [isConnected] = useContext(ConnexionContext);

    const [objectIdParcel, setObjectid] = useState();

    const [id, setId] = useState();
    const [saveShipment, setShipment] = useState();
    const [saveShippo, setShippo] = useState();

    const navRedirect = useNavigate();

    const [InformationUser, setInformationUser] = useState({lastname: '', firstname: '', email: '',adress: '',city: '',zipcode: '',country: ''});
    const [Tempoadress, setTempoadress] = useState(false);
    const [increment, setincrement] = useState(1)
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

    const changeAdress = (e) => {
      e.preventDefault();
      setInformationUser({lastname: '', firstname: '', email: '',adress: '',city: '',zipcode: '',country: ''})
      setTempoadress(true);
    }
    const fetch_country = async () => {
      if(InformationUser == {}){
        await fetch("http://restcountries.com/v3.1/alpha/" + InformationUser.country)
        .then((response) => response.json())
        .then((data) =>setCountries(data));
      }else{
        await fetch("http://restcountries.com/v3.1/region/europe")
        .then((response) => response.json())
        .then((data) =>setCountries(data));
  
        await fetch("http://restcountries.com/v3.1/region/north america")
        .then((response) => response.json())
        .then((data) =>setNorth(data));
      }
    };

    const fetch_information = () =>{
      if(isConnected){
        fetch("http://localhost:8000/userinformation", {
          method: "POST",
          headers: {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify({id: user_id})
        })
        .then((response) => response.json())
        .then((data) =>{
          if(data.zipcode){
            setInformation({lastname: data.lastname, firstname: data.firstname, email: data.email ,adress: data.adress ,city: data.city,zipcode: data.zipcode.toString(), country: data.country,id:user_id})
          }else{
            setInformation({lastname: data.lastname, firstname: data.firstname, email: data.email ,adress: data.adress ,city: data.city,zipcode: data.zipcode, country: data.country,id:user_id})
          }
          setInformationUser(data)
        });
      }else{
        fetch("http://localhost:8000/userinformation", {
          method: "POST",
          headers: {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify({id: "null"})
        })
        .then((response) => response.json());
      }
    }
    useEffect(() => {
      fetch_information();
      fetch_country();
      if(localStorage.getItem("deliveryInformation")){
        setInformation(JSON.parse(localStorage.getItem("deliveryInformation")))
      }
    },[]);

    const handleChange = (e) => {
      setInformation({ ...information, [e.target.name]: e.target.value });
    };

    const handleChangeCountry = (e) => {
      setcodecountry(e.target.value);
      setInformation({...information, country: e.target.value})
    };

    const handleChangeExpedition = (e) => {
      setPriceExpedition(e.target.value);
     // console.log(e.target.id - 1)
      setId(e.target.id - 1);
    };
    

    const handleSaveNewArticleClick = async (e) => {
      e.preventDefault();


        if(Tempoadress === false){
          // console.log(information)
          fetch("http://localhost:8000/user", {
            method: "PUT",
            headers: {
              "Content-Type" : "application/json"
            },
            body: JSON.stringify(information)
          })
        }
        else {
        localStorage.setItem("deliveryInformation", JSON.stringify(information))
       }

      const shippo = new Shippo({apiKeyHeader: 'shippo_test_963e401ee4115d95511dec754cf2f3a349e00f3c'});
      setShippo(shippo);
      
      

    const result = await shippo.customsDeclarations.create({
      certify: true,
      certifySigner: "LEX HOLORGERIE",
      contentsType: "MERCHANDISE",
      items: [
        {
          description: "watch",
          massUnit: "lb",
          metadata: "Order ID \"123454\"",
          netWeight: "1",
          originCountry: "US",
          quantity: 1,
          skuCode: "HM-123",
          hsCode: "0901.21",
          valueAmount: "200",
          valueCurrency: "USD",
        },
      ],
      nonDeliveryOption: "RETURN",
      test: true,
    });

      const addressFrom = {
        name: "EPITECH",
        street1: "101 Independence Avenue, S.E.",
        city: "Washington",
        state: "DC",
        zip: "20559-6000",
        phone: "12646744633",
        email: "lex_holorgerie@epitech.eu",
        country: "US",
      };

      const addressTo = {
        name: information.lastname + ' ' + information.firstname,
        street1: information.adress,
        city: information.city,
        state: codeCountry,
        zip: information.zipcode,
        phone: "12646754667",
        email: information.email,
        country: codeCountry,
      };

      const parcel = {
        length: "5",
        width: "2",
        height: "5",
        distanceUnit: "in",
        weight: "5",
        massUnit: "lb"
      };

      const shipment = await shippo.shipments.create({
        addressFrom: addressFrom,
        addressTo: addressTo,
        parcels: [parcel],
        customsDeclaration: result.objectId,
        carrier_accounts: ["4a4dfb5425ea41b6be2e851306284bf5"],
        async: false
      });

      //const user_id = Cookies.get("userId");

      if(isConnected){
        // const response = await fetch('http://localhost:8000/panier', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ id: user_id }),
        // });
        // const data = await response.json();
         var user_id = Cookies.get("userId");
        var cartKey = `cart_${user_id}`; 
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

      setPanier(cart);
        //setPanier(data);
        const totalPrice = cart.reduce((acc, item) => acc + item.quantite * (item.price * (1 - item.reduction / 100)).toFixed(2), 0);
        setTotal(totalPrice);
      }else if(localStorage.getItem('cartUnlogged')){
        const cart = JSON.parse(localStorage.getItem('cartUnlogged')) || [];
        setPanier(cart);
        const totalPrice = cart.reduce((acc, item) => acc + item.quantite * (item.price * (1 - item.reduction / 100)).toFixed(2), 0);
        setTotal(totalPrice);
      }


      setRates(shipment.rates);
      setObjectid(shipment.objectId)
      setShipment(shipment);
      // console.log(shipment)
      handleOpen();
  }

    const ValidateCommand = async () =>{

     handleClose()
     const json = {id : id}
     const allInfo = {...saveShipment, ...json }
     console.log(allInfo)
     navRedirect(`/payment/${total}`, {state:allInfo})
     

    }
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Vos Coordonnées</h1>
         
          <form className="max-w-lg mx-auto bg-white p-8 shadow-md rounded-lg">
          {isConnected === true ? (
              <button onClick={changeAdress}className="mt-8 bg-green-700 mx-auto text-white font-medium rounded-lg text-lg px-6 py-3 hover:bg-gray-700 transition duration-200">Je veux être livrer ailleurs</button>
            ) : (
              <p></p>
            )}
            <div className="mb-4">
              <label htmlFor="lastname" className="block text-gray-700 font-bold mb-2">Nom:</label>
              {InformationUser.lastname ? (
                <input value={InformationUser.lastname} type="text" id="lastname" name="lastname" className="w-full p-2 border border-gray-300 rounded" disabled/>
              ) : (
                <input onChange={handleChange} value={information.lastname} type="text" id="lastname" name="lastname" className="w-full p-2 border border-gray-300 rounded"/>
              )}
             
            </div>
            <div className="mb-4">
              <label htmlFor="firstname" className="block text-gray-700 font-bold mb-2">Prénom:</label>
              {InformationUser.firstname? (
                <input value={InformationUser.firstname} type="text" id="firstname" name="firstname" className="w-full p-2 border border-gray-300 rounded" disabled/>
              ) : (
                <input onChange={handleChange} value={information.firstname} type="text" id="firstname" name="firstname" className="w-full p-2 border border-gray-300 rounded"/>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>
              {InformationUser.email ? (
                <input value={InformationUser.email} type="text" id="email" name="email" className="w-full p-2 border border-gray-300 rounded" disabled/>
              ) : (
              <input onChange={handleChange} value={information.email} type="text" id="email" name="email" className="w-full p-2 border border-gray-300 rounded"/>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="adress" className="block text-gray-700 font-bold mb-2">Adresse:</label>
              {InformationUser.adress ? (
              <input value={InformationUser.adress} type="text" id="adress" name="adress" className="w-full p-2 border border-gray-300 rounded" disabled/>
              ): (
              <input onChange={handleChange} value={information.adress} type="text" id="adress" name="adress" className="w-full p-2 border border-gray-300 rounded"/>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="city" className="block text-gray-700 font-bold mb-2">Ville:</label>
              {InformationUser.city ? (
                <input value={InformationUser.city} type="text" id="city" name="city" className="w-full p-2 border border-gray-300 rounded" disabled/>
              ): (

                <input onChange={handleChange} value={information.city} type="text" id="city" name="city" className="w-full p-2 border border-gray-300 rounded"/>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="zipcode" className="block text-gray-700 font-bold mb-2">Code Postal:</label>
              {InformationUser.zipcode ? (
                <input value={InformationUser.zipcode} type="text" id="city" name="city" className="w-full p-2 border border-gray-300 rounded" disabled/>
              ) : (
               <input onChange={handleChange} value={information.zipcode} type="number" id="zipcode" name="zipcode" className="w-full p-2 border border-gray-300 rounded"/>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="country" className="block text-gray-700 font-bold mb-2">Pays:</label>
              <select onChange={handleChangeCountry} id="country" name="country" className="w-full p-2 border border-gray-300 rounded">
                  <option value="">Sélectionnez un pays</option>
                {countries.map(countrie => 
                  <option key={countrie.cca2} value={countrie.cca2}>{countrie.name.common}</option>
                )}
                {north.map(us => 
                  <option key={us.cca2} value={us.cca2}>{us.name.common}</option>
                )}      
              </select>
            </div>
            <div className="text-center">
              <button onClick={handleSaveNewArticleClick} className="bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-700">Envoyer</button>
            </div>
          </form>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto" sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Résumé de votre commande
              </Typography>
              {panier.map((article, index) => (
                <ArticleCardPanier key={index} article={article} />
              ))}
              {rates === null ? (
                <p></p>
              ) : (
                rates.map((rate, index) => (
                  <div key={index} className="my-2">
                    <input type="radio" id={index+1} name="fees" value={rate.amount} onClick={handleChangeExpedition} className="mr-2"/>
                    <label htmlFor={rate.attributes[0]} className="text-gray-700">
                      {rate.provider + ": "}
                      {rate.amount + "$"}
                      {" Delivery estimated in " + rate.estimatedDays + " days"}
                    </label>
                  </div>
                ))
              )}
              <p className="mt-4 font-bold text-lg">Total : {(parseInt(total, 10) + parseFloat(priceExpedition, 10)) + '$'}</p>
              <div className="text-center">
                <button className="mt-4 mb-4 bg-black text-white font-medium rounded-lg text-sm px-5 py-2.5" onClick={ValidateCommand}>Passez au Paiement</button>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    );
}
export default Commande;
