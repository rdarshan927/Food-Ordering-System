import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../config/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const sessionId = searchParams.get('session_id');

      if (sessionId) {
        try {
          const response = await api.post('/api/paymentsuccess', { sessionId });
          if (response.status === 200) {
            console.log('✅ Payment verified successfully');
          } else {
            console.error('❌ Payment verification failed', response.status);
          }
        } catch (error) {
          console.error('⚠️ Error verifying payment:', error);
        }
      } else {
        console.warn('No session ID found in query parameters');
      }
    };

    fetchPaymentDetails();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <a
          href="/"
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
        >
          ×
        </a>
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-6">
          Thank you for your purchase. Your order is being processed.
        </p>
        <a
          href="/"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;
