import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams } from "react-router-dom";
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

// Other Pages
import MenuManagement from './pages/Restaurant/MenuManagement.jsx';
import ProfileSettings from "./pages/Restaurant/ProfileSettings.jsx";

import styles from "./App.module.css";

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
      {/* <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID" }}> */}
        <div className={`min-h-screen flex flex-col ${styles.appContainer} ${darkMode ? 'dark-mode' : ''}`}>
          <Header />
          <button
            onClick={toggleDarkMode}
            className={styles.darkModeToggle}
            aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
          <main className="flex-grow">
            <Routes>
              {/* Home and Main Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
              
              {/* Authentication Routes */}
              <Route path="/login" element={<Navigate to="/auth/login" replace />} />
              <Route path="/register" element={<Navigate to="/auth/register" replace />} />
              
              <Route path="/login2" element={<Login2/>} />
              <Route path="/register2" element={<Register2 />} />
              
              {/* Management Routes */}
              <Route path="/menu-management" element={<MenuManagement />} />
              <Route path="/profile" element={<ProfileSettings darkMode={darkMode} />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              
              {/* Driver Routes */}
              <Route path="/driverdashboard" element={<DriverDashboard />} />
              <Route path="/driver/:driverId" element={<DriverDeliveryPageWrapper />} />
              
              {/* Payment Routes */}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="add-payment" element={<AddPaymentMethod/>}/>
              <Route path="/customer-dashboard" element={<CustomerDashboard />} />
            </Routes>
          </main>
        </div>
      {/* </PayPalScriptProvider> */}
    </Router>
  );
};

export default App;