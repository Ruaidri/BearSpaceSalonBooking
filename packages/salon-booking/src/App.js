import React from 'react';
import VoiceBookingRecorder from './VoiceBookingRecorder';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import './input.css';

const stripePromise = loadStripe('pk_test_klJRFwoljnK57pINirDY3SL0');  // Your Stripe public key

function App() {
  return (
    <Elements stripe={stripePromise}>
      <VoiceBookingRecorder />
    </Elements>
  );
}

export default App;
