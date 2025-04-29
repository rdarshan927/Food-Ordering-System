import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import './PaymentForm.css';

const stripePromise = loadStripe("pk_test_51RA7PB2XiQfMIAieydMtNj0L7W56UZd5PQfDz3Y3wDvTv5DC7PgrpXYC52XvToeOHF1pCkN4tU9IeRdwn5ijHL2b005J6WyZTu");

const PaymentOptions = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  
  // Add missing state variables
  const [selectedMethod, setSelectedMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [voucherMessage, setVoucherMessage] = useState("");
  const [orderSummary, setOrderSummary] = useState({
    items: [],
    total: 0,
    deliveryAddress: '',
    receiverPhone: ''
  });

  useEffect(() => {
    const details = localStorage.getItem('paymentDetails');
    if (details) {
      setOrderSummary(JSON.parse(details));
    }
  }, []);

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    setErrorMessage("");
  };

  const handleVoucherCheck = () => {
    // Add voucher validation logic here
    setVoucherMessage("Voucher applied successfully!");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!stripe || !elements) {
      setErrorMessage("Stripe not loaded yet.");
      setLoading(false);
      return;
    }

    try {
      switch (selectedMethod) {
        case "card": {
          const { data: paymentData } = await axios.post("http://localhost:5056/api/stripe/create-payment-intent", {
            amount: orderSummary.total * 100,
            currency: "inr",
            items: orderSummary.items
          });

          const result = await stripe.confirmCardPayment(paymentData.clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                address: orderSummary.deliveryAddress,
                phone: orderSummary.receiverPhone
              },
            },
          });

          if (result.error) {
            setErrorMessage(`Payment failed: ${result.error.message}`);
          } else if (result.paymentIntent.status === "succeeded") {
            localStorage.removeItem('paymentDetails');
            navigate('/payment-success');
          }
          break;
        }

        case "cod": {
          await axios.post("http://localhost:5051/api/orders/create", {
            items: orderSummary.items,
            total: orderSummary.total,
            paymentMethod: 'cod',
            deliveryAddress: orderSummary.deliveryAddress,
            receiverPhone: orderSummary.receiverPhone
          });
          
          localStorage.removeItem('paymentDetails');
          navigate('/payment-success');
          break;
        }

        default:
          setErrorMessage("Please select a payment method");
      }
    } catch (err) {
      console.error("Error during payment process:", err);
      setErrorMessage("An error occurred while processing the payment.");
    }

    setLoading(false);
  };

  // Order Summary Component
  const OrderSummary = () => (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
      <div className="space-y-2">
        {orderSummary.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.productName} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total Amount:</span>
            <span>₹{orderSummary.total}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handlePayment} className="payment-form">
      <h2 className="text-2xl font-semibold text-center mb-6">Payment Details</h2>
      
      <OrderSummary />

      <div className="space-y-4">
        <label className="block">
          <input 
            type="radio" 
            name="method" 
            value="card" 
            checked={selectedMethod === "card"}
            onChange={() => handleMethodChange("card")} 
          /> Card Payment
        </label>
        {selectedMethod === "card" && (
          <div className="p-4 border rounded-md">
            <CardElement />
          </div>
        )}

        <label className="block">
          <input 
            type="radio" 
            name="method" 
            value="cod" 
            checked={selectedMethod === "cod"}
            onChange={() => handleMethodChange("cod")} 
          /> Cash on Delivery
        </label>

        <label className="block">
          <input 
            type="radio" 
            name="method" 
            value="paypal" 
            checked={selectedMethod === "paypal"}
            onChange={() => handleMethodChange("paypal")} 
          /> PayPal
        </label>
      </div>

      {errorMessage && (
        <div className="error-message mt-4 text-red-500 text-center">
          {errorMessage}
        </div>
      )}

      {selectedMethod && (
        <button 
          type="submit" 
          disabled={loading} 
          className="btn-submit mt-6 w-full py-3 px-4 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Processing..." : "Proceed to Pay"}
        </button>
      )}
    </form>
  );
};

const AddPaymentMethod = () => (
  <Elements stripe={stripePromise}>
    <PaymentOptions />
  </Elements>
);

export default AddPaymentMethod;
