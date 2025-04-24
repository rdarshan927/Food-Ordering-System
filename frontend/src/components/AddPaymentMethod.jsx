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
  const [voucherStatus, setVoucherStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVoucherCheck = async () => {
    try {
      const response = await axios.get(`http://localhost:5056/api/vouchers/${voucherCode}`);
      const now = new Date();
      const expiry = new Date(response.data.expirationDate);

      if (expiry > now) {
        setVoucherStatus("valid");
        alert("Voucher applied!");
      } else {
        setVoucherStatus("expired");
        alert("Voucher has expired.");
      }
    } catch {
      setVoucherStatus("invalid");
      alert("Voucher not found.");
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      alert("Stripe not loaded yet.");
      setLoading(false);
      return;
    }

    switch (selectedMethod) {
      case "card":
        try {
          const { data } = await axios.post("http://localhost:5056/api/stripe/create-payment-intent", {
            amount: 1000, // amount in cents = $10.00
            currency: "usd"
          });

          const result = await stripe.confirmCardPayment(data.clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: "Test User",
              },
            },
          });

          if (result.error) {
            alert(`Payment failed: ${result.error.message}`);
          } else {
            if (result.paymentIntent.status === "succeeded") {
              alert("Card payment successful!");
            }
          }
        } catch (err) {
          console.error("Stripe card error:", err);
          alert("An error occurred while processing payment.");
        }
        break;

      case "voucher":
        if (voucherStatus === "valid") {
          alert("Voucher applied. Proceeding with order...");
        } else {
          alert("Invalid or expired voucher.");
        }
        break;

      case "paypal":
        try {
          const { data } = await axios.post("http://localhost:5056/api/paypal/create-payment", {
            amount: "10.00",
            currency: "USD",
          });
          window.location.href = data.forwardLink;
        } catch {
          alert("PayPal payment creation failed.");
        }
        break;

      case "cod":
        alert("Order placed with Cash on Delivery.");
        break;

      default:
        alert("Select a payment method.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handlePayment} className="payment-form">
      <h2 className="text-2xl font-semibold text-center">Add Payment Method</h2>

      <div className="space-y-4">
        <label className="block">
          <input
            type="radio"
            name="method"
            value="card"
            onChange={() => setSelectedMethod("card")}
          />{" "}
          Card Payment
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
            value="voucher"
            onChange={() => setSelectedMethod("voucher")}
          />{" "}
          Voucher Code
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
            <button type="button" onClick={handleVoucherCheck} className="btn-apply">
              Apply
            </button>
          </div>
        )}

        <label className="block">
          <input
            type="radio"
            name="method"
            value="cod"
            onChange={() => setSelectedMethod("cod")}
          />{" "}
          Cash on Delivery
        </label>

        <label className="block">
          <input
            type="radio"
            name="method"
            value="paypal"
            onChange={() => setSelectedMethod("paypal")}
          />{" "}
          PayPal
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-submit"
      >
        {loading ? "Processing..." : "Proceed to Pay"}
      </button>
    </form>
  );
};

const AddPaymentMethod = () => (
  <Elements stripe={stripePromise}>
    <PaymentOptions />
  </Elements>
);

export default AddPaymentMethod;
