import React, { useState, useEffect } from "react";
import axios from "../../services/axios"; // Your axios instance
import AddCartBtn from "../cart/AddCartBtn";

const CustomerDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all restaurants initially
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("/api/customers/restaurants");
        setRestaurants(response.data.restaurants || []);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Failed to load restaurants. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const fetchMenuItems = async (restaurantId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/customers/restaurants/${restaurantId}`);
      setSelectedRestaurant(response.data.restaurant);
      setMenuItems(response.data.restaurant.menu || []);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError("Failed to load menu items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="loader mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600">
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {!selectedRestaurant ? (
        <>
          <h1 className="text-3xl font-bold mb-6 text-center">Restaurants</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="border rounded-lg p-4 hover:shadow-lg transition cursor-pointer flex flex-col items-center"
                onClick={() => fetchMenuItems(restaurant._id)}
              >
                {restaurant.logo ? (
                  <img
                    src={`http://localhost:3000/${restaurant.logo}`}
                    alt={restaurant.name}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded mb-4">
                    No Logo
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-1">{restaurant.name}</h3>
                <p className="text-gray-500 mb-1">{restaurant.cuisine.join(", ")}</p>
                <p className={`font-semibold ${restaurant.isOpen ? "text-green-500" : "text-red-500"}`}>
                  {restaurant.isOpen ? "Open" : "Closed"}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              setSelectedRestaurant(null);
              setMenuItems([]);
            }}
            className="text-blue-600 hover:underline mb-4 flex items-center gap-2"
          >
            ← Back to Restaurants
          </button>
          <h1 className="text-3xl font-bold mb-6 text-center">{selectedRestaurant.name} - Menu</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* {menuItems.map((item) => (
              <div key={item._id} className="border rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition">
                {item.image ? (
                  <img
                    src={`http://localhost:3000/${item.image}`}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded mb-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded mb-4">
                    No Image
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{item.description || "No description available"}</p>
                <p className="font-bold text-lg">Rs. {parseFloat(item.price).toFixed(2)}</p>
              </div>
            ))} */}
            {menuItems.map((item) => (
  <div key={item._id} className="border rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition">
    {item.image ? (
      <img
        src={`http://localhost:3000/${item.image}`}
        alt={item.name}
        className="w-full h-40 object-cover rounded mb-4"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/150?text=No+Image";
        }}
      />
    ) : (
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded mb-4">
        No Image
      </div>
    )}
    <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
    <p className="text-gray-500 text-sm mb-2">{item.description || "No description available"}</p>
    <p className="font-bold text-lg mb-2">Rs. {parseFloat(item.price).toFixed(2)}</p>

    {/* Add to Cart Button */}
    <AddCartBtn item={item} />
  </div>
))}

          </div>
        </>
      )}
    </div>
  );
};

export default CustomerDashboard;
