import PayPalButton from "../../components/PayPalButton.jsx";

const Checkout = () => {
    return (
        <div>
            <h2>Checkout</h2>
            <PayPalButton amount="10.00" currency="USD" />
        </div>
    );
};

export default Checkout;
