import React, { useState, useEffect } from "react";
import { api } from "../../services/api"; // Axios instance

const AddToCartButton = ({ item }) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const userEmail = localStorage.getItem("useremailc"); // Get logged in customer email

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000); // Auto-clear feedback after 3 sec
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleAddToCart = async () => {
    console.log("Trying to add item to cart:", item); // Optional: Debugging output

    if (!userEmail) {
      setFeedback("🔐 Please login first.");
      return;
    }

    if (!item?._id || !item?.name || item?.price == null) {
      setFeedback("❌ Invalid product details.");
      return;
    }

    const payload = {
      productID: item._id,
      name: item.name,
      price: item.price,
      imageData: item.image || "",
    };

    try {
      setLoading(true);

      console.log("Sending payload:", payload); // Optional: Debugging output

      const response = await api.post(`/api/cart/${userEmail}/add`, payload);

      if (response.status === 201) {
        setFeedback("✅ Product added to cart!");
      } else {
        setFeedback("⚠️ Could not add to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error?.response?.data?.message) {
        setFeedback(`❌ ${error.response.data.message}`);
      } else {
        setFeedback("❌ Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-2">
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={`w-full text-white font-semibold py-2 rounded ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 transition"
        }`}
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>

      {feedback && (
        <div className="mt-2 text-sm text-white bg-black bg-opacity-80 p-2 rounded text-center">
          {feedback}
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
