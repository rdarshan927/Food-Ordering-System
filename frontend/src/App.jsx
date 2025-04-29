import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Order from "./pages/order/Orders.jsx";
import CartPage from "./pages/cart/CartPage.jsx";
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Checkout from "./pages/payment/Checkout.jsx"; 
// import PayPalButton from "./components/PayPalButton.jsx"; 
import AddPaymentMethod from "./components/AddPaymentMethod.jsx";
import Header from "./components/Header";
import Home from "./pages/Home";
import DriverDashboard from "./pages/Delivery/DriverDashboard";
import DriverDeliveryPage from "./pages/Delivery/DriverDeliveryPage";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import Checkout from "./pages/payment/Checkout.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import { useParams } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

const DriverDeliveryPageWrapper = () => {
  const { driverId } = useParams();
  return <DriverDeliveryPage driverId={driverId} />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/driverdashboard" element={<DriverDashboard />} />
                <Route path="/driver/:driverId" element={<DriverDeliveryPageWrapper />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order" element={<Order />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/add-payment" element={<AddPaymentMethod />} />
              </Routes>
            </main>
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;