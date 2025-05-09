import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe('pk_test_klJRFwoljnK57pINirDY3SL0');

const PaymentForm = ({ clientSecret, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Customer Name', 
          email: 'customer@example.com',
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      onPaymentSuccess(paymentIntent);
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-form-wrapper">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Complete Your Payment</h2>
      
      {/* Payment Form */}
      <form onSubmit={handlePaymentSubmit} className="payment-form">
        <div className="mt-4">
          <label className="text-sm font-semibold text-gray-700">Card Details</label>
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#333',
                  '::placeholder': {
                    color: '#aaa',
                  },
                },
              },
              hidePostalCode: true,
            }} 
          />
        </div>

        {/* Error Message */}
        {errorMessage && <div className="text-red-500 mt-2 text-sm">{errorMessage}</div>}

        <div className="mt-6">
          <button 
            type="submit" 
            className={`w-full py-3 bg-green-600 text-white font-semibold rounded-lg ${isProcessing ? 'opacity-50' : ''}`}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

const StripePaymentWrapper = ({ clientSecret, onPaymentSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6">
        <PaymentForm clientSecret={clientSecret} onPaymentSuccess={onPaymentSuccess} />
      </div>
    </Elements>
  );
};

export default StripePaymentWrapper;