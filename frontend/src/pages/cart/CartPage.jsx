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
  };

  return (
    <section className="m-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg mb-4">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <p className="flex justify-between mt-4">
              <span>Sub Total:</span><span>Rs. {total}</span>
            </p>
            <p className="flex justify-between">
              <span>Flat Discount:</span><span>00.00</span>
            </p>
            <hr className="my-2" />
            <p className="flex justify-between font-bold">
              <span>Total:</span><span>Rs. {total}</span>
            </p>
            <button
              className={`${
                carts.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              } text-white w-full py-2 rounded mt-4`}
              onClick={makePayment}
              disabled={carts.length === 0}
            >
              Checkout
            </button>
          </div>

          <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
            <h2 className="font-semibold text-lg">Receiver Details</h2>
            <p className="font-bold mt-2">Phone:</p><p>{receiverPhone}</p>
            <p className="font-bold mt-2">Address:</p><p>{deliveryAddress}</p>
            <button className="bg-blue-500 text-white py-1 px-4 rounded mt-4" onClick={() => setIsModalOpen(true)}>
              Edit
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="col-span-3">
          {carts.map((cart) => (
            <div key={cart._id} className="flex justify-between items-center bg-white dark:bg-gray-700 p-4 rounded-md mb-3">
              <div className="flex items-center">
                <img src={cart.image} alt={cart.name || cart.productName} className="w-16 h-16 rounded mr-4" />
                <div>
                  <p className="font-semibold">{cart.name || cart.productName}</p>
                  <p>Rs. {cart.price}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button onClick={() => updateCartQuantity(cart._id, cart.quantity - 1)} disabled={cart.quantity <= 1} className="px-2">-</button>
                <span className="mx-2">{cart.quantity}</span>
                <button onClick={() => updateCartQuantity(cart._id, cart.quantity + 1)} className="px-2">+</button>
              </div>
              <p className="w-20 text-center">Rs. {cart.price * cart.quantity}</p>
              <button onClick={() => handleDelete(cart._id)} className="text-red-600"><MdDelete size={24} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg dark:bg-gray-800 dark:text-white">
            <h3 className="text-lg font-bold mb-4">Edit Receiver Details</h3>
            <label className="block mb-2">Phone Number</label>
            <input
              value={receiverPhone}
              onChange={(e) => {
                setReceiverPhone(e.target.value);
                setErrors((prev) => ({ ...prev, phone: "" }));
              }}
              className="w-full p-2 mb-2 border rounded"
            />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
            <label className="block mb-2">Delivery Address</label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => {
                setDeliveryAddress(e.target.value);
                setErrors((prev) => ({ ...prev, address: "" }));
              }}
              className="w-full p-2 mb-2 border rounded"
            />
            {errors.address && <p className="text-red-500">{errors.address}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={updateDelivery} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CartPage;
