import React, { useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import './PaymentForm.css';

const stripePromise = loadStripe("pk_test_51RA7PB2XiQfMIAieydMtNj0L7W56UZd5PQfDz3Y3wDvTv5DC7PgrpXYC52XvToeOHF1pCkN4tU9IeRdwn5ijHL2b005J6WyZTu");

const PaymentOptions = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [selectedMethod, setSelectedMethod] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherMessage, setVoucherMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleVoucherCheck = async () => {
    if (voucherCode && expirationDate) {
      try {
        const orderData = {
          code: voucherCode,
          expirationDate: expirationDate,
        };
        // Post voucher details to the backend
        const response = await axios.post("http://localhost:5056/api/vouchers", orderData);

        if (response.status === 201) {
          setVoucherApplied(true);
          setVoucherMessage("Voucher applied successfully!");
        } else {
          setVoucherMessage("Failed to apply voucher.");
        }
      } catch (error) {
        console.error("Error applying voucher:", error);
        setVoucherMessage("An error occurred while applying the voucher.");
      }
    } else {
      setVoucherMessage("Please enter a valid voucher code and expiration date.");
    }
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

    if (!selectedMethod) {
      setErrorMessage("Please select a payment method.");
      setLoading(false);
      return;
    }

    try {
      let orderData = {};

      if (voucherApplied) {
        orderData = {
          voucherCode: voucherCode,
          expirationDate: expirationDate,
        };
        const response = await axios.post("http://localhost:5056/api/vouchers", orderData);

        if (response.status !== 201) {
          setErrorMessage("Failed to save voucher details.");
          setLoading(false);
          return;
        }
      }

      switch (selectedMethod) {
        case "card": {
          const { data: paymentData } = await axios.post("http://localhost:5056/api/stripe/create-payment-intent", {
            amount: 1000, // $10.00
            currency: "usd",
          });

          const result = await stripe.confirmCardPayment(paymentData.clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: "Test User",
              },
            },
          });

          if (result.error) {
            setErrorMessage(`Payment failed: ${result.error.message}`);
          } else if (result.paymentIntent.status === "succeeded") {
            alert("Card payment successful!");
          }
          break;
        }

        case "voucher": {
          if (voucherApplied) {
            alert("Voucher applied. Order successful!");
          } else {
            setErrorMessage("Invalid or expired voucher.");
          }
          break;
        }

        case "cod": {
          alert("Order placed with Cash on Delivery.");
          break;
        }

        case "paypal": {
          const { data: paypalData } = await axios.post("http://localhost:5056/api/paypal/create-payment", {
            amount: "10.00",
            currency: "USD",
          });
          window.location.href = paypalData.forwardLink;
          break;
        }

        default: {
          setErrorMessage("Invalid payment method selected.");
          break;
        }
      }
    } catch (err) {
      console.error("Error during payment process:", err);
      setErrorMessage("An error occurred while processing the payment.");
    }

    setLoading(false);
  };

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    if (method !== "voucher") {
      setVoucherCode("");
      setExpirationDate("");
      setVoucherApplied(false);
      setVoucherMessage("");
    }
  };

  return (
    <form onSubmit={handlePayment} className="payment-form">
      <h2 className="text-2xl font-semibold text-center mb-6">Add Payment Method</h2>

      <div className="space-y-4">
        <label className="block">
          <input type="radio" name="method" value="card" onChange={() => handleMethodChange("card")} /> Card Payment
        </label>
        {selectedMethod === "card" && (
          <div className="p-4 border rounded-md">
            <CardElement />
          </div>
        )}

        <label className="block">
          <input type="radio" name="method" value="voucher" onChange={() => handleMethodChange("voucher")} /> Voucher Code
        </label>
        {selectedMethod === "voucher" && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="Enter voucher code"
              className="input-field"
            />
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              placeholder="Enter expiration date"
              className="input-field"
            />
            <button type="button" onClick={handleVoucherCheck} className="btn-apply">
              Apply
            </button>
            {voucherMessage && <span className="text-green-500">{voucherMessage}</span>}
          </div>
        )}

        <label className="block">
          <input type="radio" name="method" value="cod" onChange={() => handleMethodChange("cod")} /> Cash on Delivery
        </label>

        <label className="block">
          <input type="radio" name="method" value="paypal" onChange={() => handleMethodChange("paypal")} /> PayPal
        </label>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {selectedMethod && (
        <button type="submit" disabled={loading} className="btn-submit mt-6">
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
