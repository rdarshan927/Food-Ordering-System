import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AddCartBtn from "../cart/AddCartBtn";

const RestaurantDetail = () => {
  const { restaurantId } = useParams();
  const [searchParams] = useSearchParams();
  const highlightItemId = searchParams.get('highlight');
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch restaurant details when component mounts
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/customers/restaurants/${restaurantId}`);
        setRestaurant(response.data.restaurant);
        setMenuItems(response.data.restaurant.menu || []);
        
        // If there's a highlighted item, scroll to it
        if (highlightItemId) {
          setTimeout(() => {
            const element = document.getElementById(`menu-item-${highlightItemId}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.classList.add('highlight-animation');
            }
          }, 500);
        }
      } catch (err) {
        console.error("Error fetching restaurant details:", err);
        setError("Failed to load restaurant details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchRestaurantDetails();
    }
  }, [restaurantId, highlightItemId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error || "Restaurant not found"}</p>
        </div>
        <button 
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Restaurant Header */}
      <div className="w-full h-64 bg-cover bg-center relative" 
           style={{ 
             backgroundImage: restaurant.coverImage 
               ? `url(http://localhost:3000/${restaurant.coverImage})` 
               : 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)'
           }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg">{restaurant.cuisine?.join(", ")}</p>
            <div className="mt-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'}`}>
                {restaurant.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Restaurant Description */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-3/4">
              <h2 className="text-2xl font-semibold mb-4">About {restaurant.name}</h2>
              <p className="text-gray-700">{restaurant.description}</p>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Location</h3>
                <p className="text-gray-600">
                  {restaurant.location?.address}, {restaurant.location?.city} {restaurant.location?.postalCode}
                </p>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Contact</h3>
                <p className="text-gray-600">{restaurant.telephoneNumber}</p>
              </div>
            </div>
            
            <div className="md:w-1/4 mt-6 md:mt-0 flex justify-center">
              {restaurant.logo && (
                <img 
                  src={`http://localhost:3000/${restaurant.logo}`} 
                  alt={restaurant.name} 
                  className="w-32 h-32 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=No+Logo";
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <h2 className="text-3xl font-bold mb-6">Menu</h2>
        {menuItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-700">No menu items available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div 
                key={item._id} 
                id={`menu-item-${item._id}`}
                className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${
                  highlightItemId === item._id ? 'border-2 border-orange-500' : ''
                }`}
              >
                <img 
                  src={item.image ? `http://localhost:3000/${item.image}` : "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"} 
                  alt={item.name} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80";
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                  <p className="text-gray-600 mb-2">{item.description || "No description available"}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-orange-500 font-bold">Rs. {parseFloat(item.price).toFixed(2)}</span>
                    {restaurant.isOpen ? (
                      <AddCartBtn item={{...item, restaurantId: restaurant._id}} />
                    ) : (
                      <span className="text-red-500 text-sm">Restaurant is closed</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;