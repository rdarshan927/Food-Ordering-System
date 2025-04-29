import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Checkout from "./pages/payment/Checkout.jsx"; 
// import Order from "./pages/order/Orders.jsx";
import CartPage from "./pages/cart/CartPage.jsx";

import Header from "./components/Header";
import Home from "./pages/Home";
import DriverDashboard from "./pages/Delivery/DriverDashboard";
import DriverDeliveryPage from "./pages/Delivery/DriverDeliveryPage";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import { useParams } from "react-router-dom";

const DriverDeliveryPageWrapper = () => {
  const { driverId } = useParams();
  return <DriverDeliveryPage driverId={driverId} />;
};

function App() {
  return (
    // Only one Router wrapping everything
    <Router>
      {/* <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID" }}> */}
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/driverdashboard" element={<DriverDashboard />} />
              <Route path="/driver/:driverId" element={<DriverDeliveryPageWrapper />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              {/* PayPal checkout page route */}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="add-payment" element={<AddPaymentMethod/>}/>
              <Route path="/order" element={<Order />} />
          <Route path="/cart" element={<CartPage />} />
          
        </Routes>
          </main>
        </div>
      {/* </PayPalScriptProvider> */}
    </Router>
  );
}

export default App;