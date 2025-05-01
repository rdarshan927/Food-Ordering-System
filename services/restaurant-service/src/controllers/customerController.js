const Restaurant = require("../models/Restaurant");

// Get all restaurants (basic info only)
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({}, "name location cuisine logo coverImage isOpen");
    res.json({ restaurants });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get restaurant details + menu
exports.getRestaurantDetails = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    res.json({ restaurant });
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Search restaurants by name or cuisine
exports.searchRestaurants = async (req, res) => {
  try {
    const { query } = req.query; // query parameter like /api/customers/search?query=pizza

    const restaurants = await Restaurant.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // case-insensitive name match
        { cuisine: { $regex: query, $options: "i" } }
      ]
    }, "name location cuisine logo coverImage isOpen");

    res.json({ restaurants });
  } catch (error) {
    console.error("Error searching restaurants:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
