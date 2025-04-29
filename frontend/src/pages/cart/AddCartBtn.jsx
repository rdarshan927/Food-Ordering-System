import React, { useState, useEffect } from "react";
import { api } from '../../config/api';

const AddCartBtn = ({ product }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const userEmail = localStorage.getItem('useremailc'); // Customer's email stored locally

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleAddToCart = async () => {
        if (!product || Object.keys(product).length === 0) {
            setMessage("❌ Invalid product data.");
            return;
        }

        if (!product._id) {
            setMessage("❌ Product ID is missing.");
            return;
        }

        if (!userEmail) {
            setMessage("🔐 Please login first.");
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const payload = {
                productID: product._id,
                name: product.name,
                price: product.price,
                imageData: product.image ?? "",
            };

            const response = await api.post(`/api/cart/add/${userEmail}`, payload);

            if (response.status === 201) {
                setMessage("✅ Product added to cart!");
            }
        } catch (err) {
            if (err?.response?.status === 400 || err?.response?.status === 401) {
                setMessage(`⚠️ ${err.response.data.message}`);
            } else {
                setMessage("❌ Failed to add product to cart.");
            }
            console.error("Cart Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <button
                onClick={handleAddToCart}
                disabled={loading}
                className={`${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                } text-white font-semibold px-5 py-2 rounded transition-all`}
            >
                {loading ? "Adding..." : "Add to Cart"}
            </button>

            {message && (
                <p className="mt-2 text-sm text-white bg-black bg-opacity-80 p-2 rounded">
                    {message}
                </p>
            )}
        </div>
    );
};

export default AddCartBtn;
