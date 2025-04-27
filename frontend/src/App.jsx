import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
// import Checkout from "./pages/payment/Checkout.jsx"; 
// import PayPalButton from "./components/PayPalButton.jsx"; 

import Header from "./components/Header";
import Home from "./pages/Home";
import DriverDashboard from "./pages/Delivery/DriverDashboard";
import DriverDeliveryPage from "./pages/Delivery/DriverDeliveryPage";
import CustomerTrackingPage from "./pages/Delivery/CustomerTrackingPage";
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
      {/* <PayPalScriptProvider options={{ "client-id": "AUjO0gMonzBSbqs-X0hl9Ty_A1wSgNpM5-JDBuWtBBoR_VNDanI2rlWyGyNQP2PIe2tT00r6vBwQ3Dew" }}> */}
        <div className="min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/driverdashboard" element={<DriverDashboard />} />
              <Route path="/customertracking/:orderId" element={<CustomerTrackingPage />} />
              <Route path="/driver/:driverId" element={<DriverDeliveryPageWrapper />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              {/* PayPal checkout page route */}
              {/* <Route path="/checkout" element={<Checkout />} /> */}
            </Routes>
          </main>
        </div>
      {/* </PayPalScriptProvider> */}
    </Router>
  );
}

export default App;
