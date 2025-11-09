import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

function Stripe() {

    const PUBLIC_KEY = "pk_test_51Pt7PiRwJ0OMdpxiDK5MndiDNf0UvzG7U86wshx3tT5hozl0GL4PYe6FmGwNBOLCYKgfNKpO6jOaLD8MTb70hjjE00v8NAe4N1";
    const stripeTestPromise = loadStripe(PUBLIC_KEY)

  return (
    <div className='text-black'>
    <Elements  stripe={stripeTestPromise}>
      
      <CheckoutForm />

    </Elements>

    </div>
  )
}

export default Stripe