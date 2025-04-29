const mongoose = require('mongoose');
const UserModel = require('../models/userModel');
const CartModel = require('../models/cartModel');
// 📦 Create Cart Entry
const createCart = async (req, res) => {
    try {
        const { productID, name, price, imageData } = req.body;
        const userEmail = req.params.id;

        if (!userEmail) return res.status(401).json({ message: 'Login first!' });

        const user = await UserModel.findOne({ email: userEmail });
        if (!user) return res.status(401).json({ message: 'Login first!' });

        const alreadyExist = await CartModel.findOne({ productID, userEmail });

        if (alreadyExist) {
            return res.status(400).json({ message: 'Product already added to cart!' });
        }

        const newCart = new CartModel({
            productID,
            productName: name,
            quantity: 1,
            price,
            image: imageData,
            userEmail,
        });

        await newCart.save();
        return res.status(201).json({ message: 'Product added to cart successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add product to cart.' });
    }
};

// 🛒 Get All Cart Items for a User
const getCart = async (req, res) => {
    const userEmail = req.params.id;

    try {
        const carts = await CartModel.find({ userEmail });
        res.status(200).json(carts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cart items.' });
    }
};

// 📍 Get Delivery Details for a User
const getDelivery = async (req, res) => {
    const userEmail = req.params.id;

    try {
        const delivery = await UserModel.findOne({ email: userEmail }).select('deliveryAddress receiverPhoneNumber');
        res.status(200).json(delivery);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching delivery details.' });
    }
};

// 🛒 Get a Single Cart Item by ID
const getSingleCart = async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.id);
        if (!cart) {
            return res.status(404).json({ message: 'Cart item not found.' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal error occurred.' });
    }
};

// 🔁 Update Quantity in Cart
const updateCart = async (req, res) => {
    const cartId = req.params.id;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).json({ message: 'Invalid Cart ID' });
    }

    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be a positive number' });
    }

    try {
        const cart = await CartModel.findById(cartId);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.quantity = quantity;
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating cart' });
    }
};

// ❌ Delete Cart Item
const deleteCart = async (req, res) => {
    const cartId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(404).json({ error: 'Invalid cart ID' });
    }

    try {
        const deleted = await CartModel.findByIdAndDelete(cartId);
        if (!deleted) return res.status(404).json({ message: 'Cart not found' });

        res.status(200).json({ message: 'Cart item deleted', data: deleted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting cart item' });
    }
};

// 🚚 Update Delivery Info
const updateDelivery = async (req, res) => {
    const email = req.params.id;
    const { receiverPhoneNumber, deliveryAddress } = req.body;

    try {
        const updated = await UserModel.findOneAndUpdate(
            { email },
            { receiverPhoneNumber, deliveryAddress },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating delivery info' });
    }
};

module.exports = {
    createCart,
    getCart,
    getSingleCart,
    updateCart,
    deleteCart,
    getDelivery,
    updateDelivery,
};