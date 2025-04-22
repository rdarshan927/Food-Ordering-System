import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Checkout from "./pages/payment/Checkout.jsx"; 
//import PayPalButton from "./components/PayPalButton.jsx"; 
import StripeCheckout from "./components/StripeCheckout.jsx";
import AddPaymentMethod from "./components/AddPaymentMethod.jsx";

// function App() {
//   return (
//     <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID" }}>
//       <Router>
//         <Routes>
//           <Route path="/" element={<h1>Home Page</h1>} />
//           <Route path="/checkout" element={<Checkout />} />
//         </Routes>
//       </Router>
//     </PayPalScriptProvider>
//   );
// }
function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<h1>Home Page</h1>} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="add-payment" element={<AddPaymentMethod/>}/>
          </Routes>
      </Router>
  );
}

export default App;