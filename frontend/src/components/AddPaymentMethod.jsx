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
          try {
            // First create payment intent
            const { data: paymentData } = await axios.post("http://localhost:5056/api/stripe/create-payment-intent", {
              amount: orderSummary.total * 100,
              currency: "inr",
              items: orderSummary.items
            });

            // Confirm card payment
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
              // Get required IDs
              const customerId = localStorage.getItem('userId');
              const restaurantId = orderSummary.items[0]?.restaurantId;

              if (!customerId || !restaurantId) {
                throw new Error('Missing required customer or restaurant ID');
              }

              console.log("Creating order with:", {
                customerId,
                restaurantId,
                items: orderSummary.items,
                totalAmount: orderSummary.total,
                paymentMethod: 'card',
                deliveryAddress: orderSummary.deliveryAddress
              });

              // Create order after successful payment
              const orderPayload = {
                  customerId: customerId,
                  restaurantId: restaurantId,
                  items: orderSummary.items.map(item => ({
                      name: item.productName,
                      price: parseFloat(item.price),
                      quantity: parseInt(item.quantity)
                  })),
                  totalAmount: parseFloat(orderSummary.total),
                  paymentMethod: 'card',
                  deliveryAddress: orderSummary.deliveryAddress || 'No address set',
                  status: 'Paid'
              };

              try {
                  console.log('Sending order payload:', orderPayload);
                  const orderResponse = await axios.post("http://localhost:5051/api/orders", orderPayload);
                  console.log('Order creation response:', orderResponse.data);

                  if (!orderResponse.data._id) {
                      throw new Error('Order creation failed - no order ID returned');
                  }

                  // Get coordinates for delivery
                  const { restaurantLatitude, restaurantLongitude, customerLatitude, customerLongitude } = orderSummary;

                  console.log("Creating delivery with:", {
                    orderId: orderResponse.data._id,
                    coordinates: {
                      shop: [restaurantLatitude, restaurantLongitude],
                      customer: [customerLatitude, customerLongitude]
                    }
                  });

                  // Create delivery with order ID from order creation response
                  await axios.post(`http://localhost:8081/api/delivery/create`, null, {
                    params: {
                      orderId: orderResponse.data._id,
                      userId: customerId,
                      shopLatitude: restaurantLatitude,
                      shopLongitude: restaurantLongitude,
                      destinationLatitude: customerLatitude,
                      destinationLongitude: customerLongitude
                    }
                  });

                  localStorage.removeItem('paymentDetails');
                  navigate('/payment-success');
              } catch (error) {
                  console.error('Order creation error:', error.response?.data || error.message);
                  throw error;
              }

            }
          } catch (err) {
            console.error("Error during payment process:", err);
            setErrorMessage(err.response?.data?.message || "An error occurred while processing the payment.");
            throw err;
          }
          break;
        }

        case "cod": {
          try {
            // First create the order
            await axios.post("http://localhost:5051/api/orders/create", {
              items: orderSummary.items,
              total: orderSummary.total,
              paymentMethod: 'cod',
              deliveryAddress: orderSummary.deliveryAddress,
              receiverPhone: orderSummary.receiverPhone
            });

            // Then create the deliveryorderResponse.data.orderId;
            // Get userId from localStorage (assuming it's stored during login)
            const userId = localStorage.getItem('userId');
            // Get restaurant coordinates from orderSummary (you'll need to add this when storing cart details)
            const { restaurantLatitude, restaurantLongitude, customerLatitude, customerLongitude } = orderSummary;
            console.log(orderSummary, "Order Summary Data");
            console.log(userId, "User ID");
            console.log(orderSummary.orderId, "Order ID");

            await axios.post(`http://localhost:8081/api/delivery/create`, null, {
              params: {
                orderId: orderSummary.orderId,
                userId: userId,
                shopLatitude: restaurantLatitude,
                shopLongitude: restaurantLongitude,
                destinationLatitude: customerLatitude,
                destinationLongitude: customerLongitude
              }
            });

            localStorage.removeItem('paymentDetails');
            navigate('/payment-success');
          } catch (err) {
            console.error("Error creating order/delivery:", err);
            throw err;
          }
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
