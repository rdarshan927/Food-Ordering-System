import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Checkout from "./pages/payment/Checkout.jsx"; 
import Order from "./pages/order/Orders.jsx";
import CartPage from "./pages/cart/CartPage.jsx";

function App() {
  return (
    <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID" }}>
      <Router>
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order" element={<Order />} />
          <Route path="/cart" element={<CartPage />} />
          
        </Routes>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
