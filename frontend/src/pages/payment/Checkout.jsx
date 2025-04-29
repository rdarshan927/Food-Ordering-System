import React from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Add your checkout form here */}
        <p>Checkout page content</p>
      </div>
    </div>
  );
};

export default Checkout;

