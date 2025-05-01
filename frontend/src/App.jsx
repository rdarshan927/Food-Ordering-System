import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams } from "react-router-dom";
import Order from "./pages/order/Orders.jsx";
import CartPage from "./pages/cart/CartPage.jsx";
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Authentication Pages
import Register from "./pages/Authentication/Register.jsx";
import Login from "./pages/Authentication/Login.jsx";

import Register2 from "./pages/Restaurant/Register.jsx";
import Login2 from "./pages/Restaurant/Login.jsx";
// Dashboard Pages
import Dashboard from "./pages/Restaurant/Dashboard.jsx";
import AdminDashboard from "./pages/Restaurant/AdminDashboard.jsx";
import Checkout from "./pages/payment/Checkout.jsx"; 
// import PayPalButton from "./components/PayPalButton.jsx"; 
import AddPaymentMethod from "./components/AddPaymentMethod.jsx";
import Header from "./components/Header";
import Home from "./pages/Home";
import DriverDashboard from "./pages/Delivery/DriverDashboard";
import DriverDeliveryPage from "./pages/Delivery/DriverDeliveryPage";
import CustomerDashboard from "./pages/Customer/CustomerDashboard.jsx";
import PaymentSuccess from "./pages/payment/PaymentSuccess.jsx";

// Other Pages
import MenuManagement from './pages/Restaurant/MenuManagement.jsx';
import ProfileSettings from "./pages/Restaurant/ProfileSettings.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import RestaurantDetail from "./pages/Customer/RestaurantDetail";

import styles from "./App.module.css";
import { AuthProvider } from "./context/AuthContext";
import CustomerTrackingPage from "./pages/Delivery/CustomerTrackingPage";

// Wrapper for pages that need params
const DriverDeliveryPageWrapper = () => {
  const { driverId } = useParams();
  return <DriverDeliveryPage driverId={driverId} />;
};

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <Router>
      <AuthProvider>
        {/* <ErrorBoundary> */}
          <div className={`min-h-screen flex flex-col ${styles.appContainer} ${darkMode ? 'dark-mode' : ''}`}>
            <Header />
            <main className="flex-grow w-full">
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

                <Route path="/register" element={<Register2 darkMode={darkMode} />} />
                <Route path="/login" element={<Login2 darkMode={darkMode} />} />
                <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
                <Route path="/menu-management" element={<MenuManagement />} />
                <Route path="/profile" element={<ProfileSettings darkMode={darkMode} />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/customer-dashboard" element={<CustomerDashboard />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/customer-tracking/:orderId" element={<CustomerTrackingPage />} />
                
                {/* Add the new restaurant detail route */}
                <Route path="/restaurant/:restaurantId" element={<RestaurantDetail />} />
                <Route path="/restaurants" element={<CustomerDashboard />} />
                
                {/* Add other routes here */}
              </Routes>
            </main>
          </div>
        {/* </ErrorBoundary> */}
      </AuthProvider>
    </Router>
  );
};

export default App;