import React, { useEffect, useState } from "react";


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
          api.get(`/api/cart/get/${userEmail}`),
          api.get(`/api/cart/get/delivery/${userEmail}`),
        ]);
        setCarts(cartRes.data);
        if (deliveryRes.data.length > 0) {
          setDeliveryAddress(deliveryRes.data[0].deliveryAddress);
          setReceiverPhone(deliveryRes.data[0].receiverPhoneNumber);
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
      await api.patch(`/api/cart/update/${id}`, { quantity: newQty });
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
      await api.delete(`/api/cart/delete/${id}`);
      setCarts((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const makePayment = async () => {
    const stripe = await loadStripe("pk_test_51Pi8DoFEujboZPsPDslDFvGmwOsAHFIdTuTPxB5VuPnNpWoWwk1W64rvX79kxiSVeA8sPQy3Di2a0AQNJYvyY4gs00TSGbrgDt");
    if (!stripe) {
      console.error("Stripe failed to load.");
      return;
    }

    try {
      const response = await api.post(`/api/paid/${userEmail}`, { products: carts });
      const session = response.data;
      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.error("Payment error", error);
    }
  };

  const updateDelivery = async () => {
    const phoneError = validatePhone(receiverPhone);
    const addressError = validateAddress(deliveryAddress);
    setErrors({ phone: phoneError, address: addressError });

    if (!phoneError && !addressError) {
      try {
        await api.patch(`/api/cart/update/delivery/${userEmail}`, {
          receiverPhoneNumber: receiverPhone,
          deliveryAddress,
        });
        setIsModalOpen(false);
      } catch (error) {
        console.error("Update delivery error", error);
      }
    }
  };return (
    <section className="bg-gradient-to-br from-indigo-50 to-teal-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-8 lg:grid-cols-4 gap-6">
  
          {/* Sidebar */}
          <aside className="col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-700 p-6 rounded-2xl shadow-lg transition-all duration-300">
              <h2 className="font-bold text-2xl mb-4 text-gray-900 dark:text-white">Order Summary</h2>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Sub Total:</span>
                  <span>Rs. {total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Flat Discount:</span>
                  <span>Rs. 0.00</span>
                </div>
                <hr className="my-4 border-gray-200 dark:border-gray-700" />
                <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                  <span>Total:</span>
                  <span>Rs. {total}</span>
                </div>
              </div>
              <button
                className={`mt-6 w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                  carts.length === 0
                    ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 dark:from-indigo-600 dark:to-teal-600 dark:hover:from-indigo-700 dark:hover:to-teal-700"
                }`}
                onClick={makePayment}
                disabled={carts.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
  
            {/* Receiver Details */}
            <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-700 p-6 rounded-2xl shadow-lg transition-all duration-300">
              <h2 className="font-bold text-2xl mb-4 text-gray-900 dark:text-white">Receiver Details</h2>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p className="font-bold mt-2">Phone:</p>
                <p>{receiverPhone}</p>
                <p className="font-bold mt-4">Address:</p>
                <p>{deliveryAddress}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white py-2 rounded-lg transition-all duration-300"
              >
                Edit Details
              </button>
            </div>
          </aside>
  
          {/* Cart Items */}
          <main className="col-span-3 space-y-4">
            {carts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md">
                <div className="bg-indigo-100 p-6 rounded-full mb-4">
                  <span className="text-4xl">🛒</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600">Start adding items to your cart!</p>
              </div>
            ) : (
              carts.map((cart) => (
                <div
                  key={cart._id}
                  className="flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-sm dark:bg-gray-700 p-4 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img
                      src={cart.image}
                      alt={cart.name || cart.productName}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{cart.name || cart.productName}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Rs. {cart.price}</p>
                    </div>
                  </div>
  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <button
                      onClick={() => updateCartQuantity(cart._id, cart.quantity - 1)}
                      disabled={cart.quantity <= 1}
                      className="bg-indigo-100 hover:bg-indigo-200 dark:bg-gray-600 dark:hover:bg-gray-500 px-3 py-1 rounded-full text-lg font-bold disabled:opacity-50 transition-all duration-300"
                    >
                      -
                    </button>
                    <span className="text-gray-900 dark:text-white">{cart.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(cart._id, cart.quantity + 1)}
                      className="bg-indigo-100 hover:bg-indigo-200 dark:bg-gray-600 dark:hover:bg-gray-500 px-3 py-1 rounded-full text-lg font-bold transition-all duration-300"
                    >
                      +
                    </button>
                  </div>
  
                  {/* Total Price and Delete */}
                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <p className="w-24 text-center font-semibold text-gray-900 dark:text-white">
                      Rs. {cart.price * cart.quantity}
                    </p>
                    <button
                      onClick={() => handleDelete(cart._id)}
                      className="text-rose-500 hover:text-rose-600 transition-all duration-300"
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
          <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Receiver Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
                <input
                  type="text"
                  value={receiverPhone}
                  onChange={(e) => {
                    setReceiverPhone(e.target.value);
                    setErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                />
                {errors.phone && <p className="text-rose-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Delivery Address</label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => {
                    setDeliveryAddress(e.target.value);
                    setErrors((prev) => ({ ...prev, address: "" }));
                  }}
                  rows="3"
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                />
                {errors.address && <p className="text-rose-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={updateDelivery}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white transition-all duration-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
  
}

export default CartPage;
