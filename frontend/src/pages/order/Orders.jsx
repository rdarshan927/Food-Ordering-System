import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios'; // Make sure axios is imported

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  
  // Get user email from localStorage
  const userID = localStorage.getItem('userId'); // Ensure you're storing email in localStorage
  
  const pageAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    if (userID) {
      fetchOrders();
    } else {
      setError('User not authenticated');
      setLoading(false);
    }
  }, [userID]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Use the endpoint to fetch orders by customer email
      const response = await axios.get(`http://localhost:5051/api/orders/customer/${userID}`);
      
      // If the response has orders property, use it (handles the empty orders case)
      if (response.data.orders) {
        setOrders(response.data.orders);
      } else {
        // Otherwise, the response is the array of orders directly
        setOrders(response.data);
      }
      
      setError('');
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
    'Pending': 'bg-amber-200 text-amber-900',     // soft orange
    'Accepted': 'bg-sky-200 text-sky-900',        // light blue
    'Preparing': 'bg-indigo-200 text-indigo-900', // medium indigo
    'On the Way': 'bg-teal-200 text-teal-900',    // calm teal
    'Delivered': 'bg-lime-200 text-lime-900',     // fresh lime green
    'Cancelled': 'bg-rose-200 text-rose-900'      // soft red
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'active') {
      return ['Pending', 'Accepted', 'Preparing', 'On the Way'].includes(order.status);
    }
    if (filter === 'completed') {
      return ['Delivered', 'Cancelled'].includes(order.status);
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }
  
  // Rest of your component stays the same
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageAnimation}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-teal-50 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={itemAnimation}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-teal-500">
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
              <h1 className="text-4xl font-bold text-white">Your Orders</h1>
              <p className="text-white/80 mt-2">Track and manage your orders</p>
            </div>
          </div>
        </motion.div>
  
        {error && (
          <motion.div
            variants={itemAnimation}
            className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl"
          >
            {error}
          </motion.div>
        )}
  
        <motion.div
          variants={itemAnimation}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex gap-4">
            {['all', 'active', 'completed'].map((filterType) => (
              <motion.button
                key={filterType}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(filterType)}
                className={`px-6 py-2 rounded-full text-sm font-medium ${
                  filter === filterType
                    ? 'bg-gradient-to-r from-indigo-500 to-teal-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-indigo-50'
                } transition-all duration-300 shadow-sm`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>
  
        <motion.div variants={itemAnimation} className="space-y-6">
          {filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              variants={itemAnimation}
              className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-6)}</h3>
                <Link
                  to={`/customer-tracking/${order._id}`}
                  className="text-indigo-500 hover:text-indigo-600"
                >
                  Track Order →
                </Link>
              </div>
              <div className="mt-4 flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(order.status)}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </motion.div>
          ))}
  
          {filteredOrders.length === 0 && (
            <motion.div
              variants={itemAnimation}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4"
                >
                  <span className="text-3xl">🍽️</span>
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all'
                    ? "You haven't placed any orders yet."
                    : filter === 'active'
                    ? "You don't have any active orders."
                    : "You don't have any completed orders."}
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/customer-dashboard"
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-teal-500 text-white hover:from-indigo-600 hover:to-teal-600 transition-all duration-300"
                  >
                    Browse Restaurants
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Orders;