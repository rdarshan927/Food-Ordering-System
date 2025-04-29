import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import "./CheckoutForm.css"; // Ensure your styles are properly linked

// Load Stripe with your public key
const stripePromise = loadStripe("pk_test_51RA7PB2XiQfMIAieydMtNj0L7W56UZd5PQfDz3Y3wDvTv5DC7PgrpXYC52XvToeOHF1pCkN4tU9IeRdwn5ijHL2b005J6WyZTu");

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage("");

        if (!stripe || !elements) {
            setMessage("Stripe has not loaded properly. Please try again.");
            setLoading(false);
            return;
        }

        try {
            // Send request to backend to create a payment intent
            const { data } = await axios.post("http://localhost:5000/api/stripe/create-payment-intent", {
                amount: 1000, // Amount in cents (e.g., 10 USD)
                currency: "usd",
            });

            // Confirm the payment with Stripe
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setMessage(`Payment failed: ${result.error.message}`);
            } else {
                alert("Payment successful!");
            }
        } catch {
            alert("An error occurred while processing payment.");
        }

        setLoading(false);
    };

    return (
        <div className="payment-container">
            <div className="payment-box">
                <h2 className="payment-title">Secure Payment</h2>
                <form onSubmit={handleSubmit}>
                    <div className="card-input">
                        <CardElement />
                    </div>
                    <button type="submit" className="pay-btn" disabled={!stripe || loading}>
                        {loading ? "Processing..." : "Pay Now"}
                    </button>
                </form>
                {message && <p className="payment-message">{message}</p>}
            </div>
        </div>
    );
};

const StripeCheckout = () => (
    <Elements stripe={stripePromise}>
        <CheckoutForm />
    </Elements>
);

export default StripeCheckout;
