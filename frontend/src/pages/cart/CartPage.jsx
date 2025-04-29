import React, { useEffect, useState } from "react";
import { api } from "../../services/api"; // Your axios instance
import { MdDelete } from "react-icons/md"; // For delete icon

const CartPage = () => {
  const [carts, setCarts] = useState([]);
  const [total, setTotal] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState("No address set");
  const [receiverPhone, setReceiverPhone] = useState("No phone number set");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({ phone: "", address: "" });

  const userEmail = localStorage.getItem("useremailc");

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) return "Phone number is required";
    if (!phoneRegex.test(phone)) return "Phone number must be 10 digits";
    return "";
  };

  const validateAddress = (address) => {
    if (!address) return "Delivery address is required";
    if (address.length < 10) return "Address must be at least 10 characters";
    return "";
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const [cartRes, deliveryRes] = await Promise.all([
          api.get(`/api/cart/${userEmail}`),
          api.get(`/api/cart/delivery/${userEmail}`)
        ]);

        // Add default restaurant coordinates if not available
        const cartsWithRestaurantInfo = cartRes.data.map(cart => ({
          ...cart,
          restaurantId: cart._id, // Using cart _id as restaurantId temporarily
          restaurantLatitude: 13.0827, // Default coordinates for testing
          restaurantLongitude: 80.2707 // Default coordinates for testing
        }));

        setCarts(cartsWithRestaurantInfo);

        if (deliveryRes.data) {
          setDeliveryAddress(deliveryRes.data.deliveryAddress || "No address set");
          setReceiverPhone(deliveryRes.data.receiverPhoneNumber || "No phone number set");
        }
      } catch (error) {
        console.error("Error loading data", error);
      }
    };
    if (userEmail) fetchCartData();
  }, [userEmail]);

  useEffect(() => {
    setTotal(carts.reduce((acc, cart) => acc + cart.price * cart.quantity, 0));
  }, [carts]);

  const updateCartQuantity = async (id, newQty) => {
    try {
      await api.patch(`/api/cart/item/${id}`, { quantity: newQty }); // ✅ Corrected
      setCarts((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, quantity: newQty } : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/cart/item/${id}`); // ✅ Corrected
      setCarts((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const makePayment = async () => {
    try {
      if (!carts.length) {
        throw new Error('Cart is empty');
      }

      const firstCart = carts[0];
      if (!firstCart) {
        throw new Error('No items in cart');
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const paymentDetails = {
        items: carts.map(item => ({
          ...item,
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
          restaurantId: item.restaurantId,
          restaurantLatitude: item.restaurantLatitude,
          restaurantLongitude: item.restaurantLongitude
        })),
        total: total,
        deliveryAddress,
        receiverPhone,
        restaurantId: firstCart.restaurantId,
        restaurantLatitude: firstCart.restaurantLatitude,
        restaurantLongitude: firstCart.restaurantLongitude,
        customerLatitude: position.coords.latitude,
        customerLongitude: position.coords.longitude
      };

      // Debug log
      console.log("Payment Details:", paymentDetails);

      // Validate all required fields
      const requiredFields = [
        'items', 'total', 'deliveryAddress', 'receiverPhone',
        'restaurantId', 'restaurantLatitude', 'restaurantLongitude',
        'customerLatitude', 'customerLongitude'
      ];

      const missingFields = requiredFields.filter(field => {
        const value = paymentDetails[field];
        return value === undefined || value === null || value === '';
      });

      if (missingFields.length) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));
      window.location.href = '/add-payment';
    } catch (error) {
      console.error("Payment error:", error.message);
    }
  };

  const updateDelivery = async () => {
    const phoneError = validatePhone(receiverPhone);
    const addressError = validateAddress(deliveryAddress);
    setErrors({ phone: phoneError, address: addressError });

    if (!phoneError && !addressError) {
      try {
        await api.patch(`/api/cart/delivery/${userEmail}`, { // Updated path to match backend route
          receiverPhoneNumber: receiverPhone,
          deliveryAddress,
        });
        setIsModalOpen(false);
      } catch (error) {
        console.error("Update delivery error", error);
      }
    }
  };

  return (
    <section className="bg-gradient-to-br from-indigo-50 to-teal-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-8 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <aside className="col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white/80 p-6 rounded-2xl shadow-lg">
              <h2 className="font-bold text-2xl mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Sub Total:</span>
                  <span>Rs. {total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Flat Discount:</span>
                  <span>Rs. 0.00</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>Rs. {total}</span>
                </div>
              </div>
              <button
                className={`mt-6 w-full py-3 rounded-lg font-semibold text-white ${
                  carts.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600"
                }`}
                onClick={makePayment}
                disabled={carts.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>

            {/* Receiver Details */}
            <div className="bg-white/80 p-6 rounded-2xl shadow-lg">
              <h2 className="font-bold text-2xl mb-4">Receiver Details</h2>
              <p className="font-semibold mt-2">Phone:</p>
              <p>{receiverPhone}</p>
              <p className="font-semibold mt-4">Address:</p>
              <p>{deliveryAddress}</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white py-2 rounded-lg"
              >
                Edit Details
              </button>
            </div>
          </aside>

          {/* Cart Items */}
          <main className="col-span-3 space-y-4">
            {carts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-white/80 rounded-2xl shadow-md">
                <span className="text-4xl">🛒</span>
                <h3 className="text-xl font-bold mt-2">Your cart is empty</h3>
                <p className="text-gray-600">Start adding items to your cart!</p>
              </div>
            ) : (
              carts.map((cart) => (
                <div
                  key={cart._id}
                  className="flex flex-col md:flex-row justify-between items-center bg-white/80 p-4 rounded-2xl shadow-md hover:scale-105 transition"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img
                      src={`http://localhost:3000/${cart.image}`}
                      alt={cart.productName}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-semibold">{cart.productName}</p>
                      <p className="text-gray-500 text-sm">Rs. {cart.price}</p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <button
                      onClick={() => updateCartQuantity(cart._id, cart.quantity - 1)}
                      disabled={cart.quantity <= 1}
                      className="bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-full text-lg font-bold disabled:opacity-50"
                    >
                      -
                    </button>
                    <span>{cart.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(cart._id, cart.quantity + 1)}
                      className="bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-full text-lg font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Total and Delete */}
                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <p className="w-24 text-center font-semibold">
                      Rs. {cart.price * cart.quantity}
                    </p>
                    <button
                      onClick={() => handleDelete(cart._id)}
                      className="text-rose-500 hover:text-rose-600"
                    >
                      <MdDelete size={24} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Edit Receiver Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">Phone Number</label>
                <input
                  type="text"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-indigo-500"
                />
                {errors.phone && <p className="text-rose-500 text-sm">{errors.phone}</p>}
              </div>
              <div>
                <label className="block mb-1 font-semibold">Delivery Address</label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows="3"
                  className="w-full p-3 border rounded-lg focus:ring-indigo-500"
                />
                {errors.address && <p className="text-rose-500 text-sm">{errors.address}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-gray-400 text-white"
              >
                Cancel
              </button>
              <button
                onClick={updateDelivery}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-teal-500 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CartPage;
