import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

const PayPalButton = ({ amount, currency }) => {
  const createOrder = async (data, actions) => {
    try {
      const res = await axios.post("http://localhost:5000/api/paypal/create-payment", {
        amount,
        currency,
      });

      return res.data.orderID; // ✅ PayPal needs the order ID, not a link
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const res = await axios.post("http://localhost:5000/api/paypal/execute-payment", {
        orderID: data.orderID, // ✅ Correctly passing order ID
      });

      alert("Payment successful!");
    } catch (error) {
      console.error("Payment execution failed:", error);
    }
  };

  return (
    <div>
      <h2>Pay with PayPal</h2>
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </div>
  );
};

export default PayPalButton;
