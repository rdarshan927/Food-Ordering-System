import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const role = localStorage.getItem("role");
  const [popularRestaurants, setPopularRestaurants] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch restaurants from your API
        const restaurantsResponse = await axios.get("http://localhost:3000/api/customers/restaurants");
        const restaurants = restaurantsResponse.data.restaurants || [];
        
        // Get top 3 restaurants for the popular section
        const topRestaurants = restaurants.slice(0, 3).map(restaurant => ({
          id: restaurant._id,
          name: restaurant.name,
          image: restaurant.logo ? `http://localhost:3000/${restaurant.logo}` : 
                 "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
          cuisine: restaurant.cuisine?.join(", ") || "Various",
          rating: (Math.random() * (5 - 4) + 4).toFixed(1), // Random rating between 4.0-5.0
          isOpen: restaurant.isOpen
        }));
        
        setPopularRestaurants(topRestaurants);
        
        // If we have restaurants, fetch menu items from the first restaurant
        if (restaurants.length > 0) {
          const menuResponse = await axios.get(`http://localhost:3000/api/customers/restaurants/${restaurants[0]._id}`);
          const menuItems = menuResponse.data.restaurant.menu || [];
          
          // Get top 3 menu items
          const topItems = menuItems.slice(0, 3).map(item => ({
            id: item._id,
            name: item.name,
            restaurant: restaurants[0].name,
            price: parseFloat(item.price),
            image: item.image ? `http://localhost:3000/${item.image}` : 
                   "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
            restaurantId: restaurants[0]._id
          }));
          
          setFeaturedItems(topItems);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Rest of your component remains the same until the map functions

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Your Favorite Food, Delivered Fast
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Discover the best restaurants in your area and get food delivered to your doorstep.
            </p>
            
            {!role ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth/login" className="bg-white text-orange-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300">
                  Login
                </Link>
                <Link to="/auth/register" className="bg-transparent border-2 border-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-orange-600 transition duration-300">
                  Register
                </Link>
              </div>
            ) : (
              <Link to="/customer-dashboard" className="bg-white text-orange-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300">
                Order Now
              </Link>
            )}
          </div>
          
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" 
              alt="Delicious Food" 
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose EzFood?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">A next-gen, cloud-native food ordering and delivery platform offering a seamless experience for customers, restaurants, and delivery drivers.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-orange-500 text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
            <p className="text-gray-600">Browse through hundreds of restaurants and thousands of dishes.</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-orange-500 text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Real-time GPS tracking to follow your order from kitchen to doorstep.</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-orange-500 text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600">Multiple payment options including PayPal, Stripe, and voucher codes.</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Popular Restaurants Section */}
      {!loading && popularRestaurants.length > 0 && (
        <div className="bg-gray-100 py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">Popular Restaurants</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularRestaurants.map(restaurant => (
                <div key={restaurant.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80";
                    }}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{restaurant.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{restaurant.cuisine}</span>
                      <div className="flex items-center">
                        <span className={`mr-3 px-2 py-1 rounded-full text-xs font-semibold ${restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {restaurant.isOpen ? 'Open' : 'Closed'}
                        </span>
                        <span className="flex items-center text-amber-500">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          {restaurant.rating}
                        </span>
                      </div>
                    </div>
                    <Link to={`/restaurant/${restaurant.id}`} className="block text-center mt-4 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300">
                      View Menu
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/restaurants" className="inline-block px-8 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition duration-300">
                See All Restaurants
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Featured Items Section */}
      {!loading && featuredItems.length > 0 && (
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8">Featured Menu Items</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80";
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                  <p className="text-gray-600 mb-3">{item.restaurant}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-500 font-bold">Rs. {item.price.toFixed(2)}</span>
                    <Link 
                      to={`/restaurant/${item.restaurantId}?highlight=${item.id}`} 
                      className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300"
                    >
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-orange-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover local restaurants, order your favorite meals, and enjoy fast delivery to your doorstep.
          </p>
          
          <Link to={role ? "/restaurants" : "/login"} className="inline-block bg-white text-orange-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300">
            {role ? "Order Now" : "Get Started"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
