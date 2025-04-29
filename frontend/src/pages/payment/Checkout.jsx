// import PayPalButton from "../../components/PayPalButton.jsx";

// const Checkout = () => {
//     return (
//         <div>
//             <h2>Checkout</h2>
//             <PayPalButton amount="10.00" currency="USD" />
//         </div>
//     );
// };

// export default Checkout;

import StripeCheckout from "../../components/StripeCheckout";
import "../../components/CheckoutForm.css";

const Checkout = () => {
    return (
        <div className="checkout-container">
            <div className="checkout-box">
                <h2 className="checkout-title">CHECKOUT YOUR ORDRER NOW !</h2>
                <p className="checkout-description">
                    Complete your payment securely with Stripe.
                </p>
                <StripeCheckout />
            </div>
        </div>
    );
};

export default Checkout;

