import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useParams } from 'react-router-dom';
import './CheckoutForm.css';
import Cookies from 'js-cookie';
import { ConnexionContext } from '../ConnexionContext';
import { useNavigate,useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Shippo } from "shippo";



function CheckoutForm() {
    const [isConnected] = useContext(ConnexionContext);
    const stripe = useStripe();
    const elements = useElements();
    const { amount } = useParams();
    const [lastPaymentMethod, setLastPaymentMethod] = useState();
    const navRedirect = useNavigate();
    const shipment = useLocation();
    const [increment, setincrement] = useState(1)


    

    const createPaymentMethod = async () => {
        var { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        });

        return paymentMethod
    }

    useEffect(() => {
        if(isConnected){
            async function fetchLastPaymentMethod(){

                let response = await fetch('https//localhost:8000/getPaymentMethod', {

                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userId: Cookies.get('userId') })
                })
    
                let receivedData = await response.json()
    
                // console.log(receivedData)
                
                if (receivedData?.methodId){
                    console.log("methode de paiement déja existante")
    
                    response = await fetch('http://localhost:8000/getPaymentInfos', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ methodId: receivedData.methodId })
                    })
        
                    receivedData = await response.json()
        
                    setLastPaymentMethod(receivedData.paymentMethod.card)
                    // console.log(receivedData.paymentMethod.card)
                }
            }
            fetchLastPaymentMethod()        
        }
    }, [isConnected])

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        });

        fetch('http://localhost:8000/payment', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({paymentMethod: paymentMethod, amount: amount})
        })
        .then(response => response.json())
        .then(receivedData => {
            if(receivedData?.clientSecret){
                // console.log(receivedData.clientSecret)
                // console.log(paymentMethod)
                stripe.confirmCardPayment(receivedData.clientSecret, {
                    payment_method: paymentMethod.id
                })
                .then(async function (result) {
                    if(result?.paymentIntent){
                        
                        const rate = shipment.state.rates[shipment.state.id];
                         console.log(shipment);
                         console.log(rate)
                        const shippo = new Shippo({apiKeyHeader: 'shippo_test_963e401ee4115d95511dec754cf2f3a349e00f3c'});

                  
                        const transaction = await shippo.transactions.create({
                          rate: rate.objectId,
                          labelFileType: "PDF",
                          async: false
                      });
                       console.log(transaction);
                      //handleClose();
                      if(transaction.status === "SUCCESS"){
                        if(isConnected){
                          const user_id = Cookies.get("userId");
                          // console.log("ok")
                    
                          fetch("https://localhost:8000/validate", {
                            method: "POST",
                            headers: {
                              "Content-Type" : "application/json"
                            },
                            body: JSON.stringify({id: user_id, command_number: transaction.objectId, tracking_number: transaction.trackingNumber})
                          })
                          .then((response) => response.json())
                          .then((data) => {
                            if((data.success === "true")){
                              Swal.fire({
                                icon: "success",
                                title: "Commande effectué !",
                                html: "Merci d'avoir passé commande chez Lex Horlogerie \n <strong>Votre numéro de Commande</strong> : " + transaction.objectId + "<br> <strong>Votre numéro de suivi</strong> : " + transaction.trackingNumber,
                                showConfirmButton: true,
                            }).then(() => {
                              navRedirect('/');
                            });
                           // console.log("passé par la")
                            //navRedirect(`/payment/${total}`)
                            }else{
                              Swal.fire({
                                icon: "error",
                                title: "Echec de la Commande",
                                text: "Veuillez réessayer",
                                showConfirmButton: true,
                            })
                            }
                          })
                        }else{
                          const commandUnlog = {
                            command_number: transaction.objectId, 
                            tracking_number: transaction.trackingNumber
                          }
                          
                          localStorage.setItem("commande_"+increment, JSON.stringify(commandUnlog));
                          setincrement(increment + 1)
                          Swal.fire({
                            icon: "success",
                            title: "Commande effectué !",
                            html: "Merci d'avoir passé commande chez Lex Horlogerie \n <strong>Votre numéro de Commande</strong> : " + transaction.objectId + "<br> <strong>Votre numéro de suivi</strong> : " + transaction.trackingNumber,
                            showConfirmButton: true,
                        }).then(() => {
                            window.location.reload()
                            navRedirect(`/`);
                        });
                        }
                      }else{
                        Swal.fire({
                          icon: "error",
                          title: "Echec de la Commande",
                          text: "Veuillez réessayer",
                          showConfirmButton: true,
                      })
                      }
                        //alert('Le paiement a été effectué')
                        let cart = null
                        if(isConnected){
                            const userId = Cookies.get('userId')
                            cart = JSON.parse(localStorage.getItem(`cart_${userId}`)); 
                            localStorage.removeItem(`cart_${userId}`) 
                        } else {
                            cart = JSON.parse(localStorage.getItem(`cartUnlogged`));
                            localStorage.removeItem(`cartUnlogged`) 
                        }
                        console.log(cart)

                        cart.forEach((article) => {
                            fetch('http://localhost:8000/decrementStock', {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ articleColorId: article.articleColorId, quantite: article.quantite })
                            })
                            .then(response => response.json())
                            .then(receivedData => {
                                if (receivedData?.success){
                                    console.log("décrémentation réussie")
                                }
                            })
                            .catch(error => console.error('Erreur lors de la décrémentation du stock: ', error));
                        });
                        if(isConnected){
                            if(lastPaymentMethod){
                                fetch('http://localhost:8000/updatePaymentMethod', {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({ methodId: paymentMethod.id ,userId: Cookies.get('userId') })
                                })
                                .then(response => response.json())
                                .then(receivedData => {
                                    console.log(receivedData)
                                })
                                .catch(error => console.error('Erreur lors de la mise à jour de la méthode de paiement: ', error));
                            } else {
                                fetch('http://localhost:8000/setPaymentMethod', {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({ methodId: paymentMethod.id ,userId: Cookies.get('userId') })
                                })
                                .then(response => response.json())
                                .then(receivedData => {
                                    console.log(receivedData)
                                })
                                .catch(error => console.error('Erreur lors de la sauvegegarde de la méthode de paiement: ', error));
                            }
                        }

                        
                    } else {
                        alert('Echec du paiement')
                    }
                });
            }
        })
        .catch(error => console.error('Erreur lors du paiement: ', error));
    };


  return (
    <div className='shadow-xl shadow-black '>
    <form className='text-black p-16' onSubmit={handleSubmit}>
        {lastPaymentMethod && (
            <div className='mb-10 text-center'>
                <p>Dernier paiement</p>
                <p>Type de carte: {lastPaymentMethod.brand}</p>
                <p>Derniers numéro: {lastPaymentMethod.last4}</p>
                <p>Datde d'expiration: {lastPaymentMethod.exp_month}/{lastPaymentMethod.exp_year}</p>
            </div>
        )}
      <CardElement
      className=""
        options={{
            hidePostalCode: true
        }}
      />
      <button className='text-black bg-red-500 mt-8 justify-center mx-auto'>Payer</button>
    </form>
    </div>
  )
}

export default CheckoutForm