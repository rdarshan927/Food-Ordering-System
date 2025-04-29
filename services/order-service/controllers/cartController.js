const mongoose = require('mongoose');
const CartModel = require('../models/cartModel');

// 📦 Create Cart Entry
const createCart = async (req, res) => {
    try {
        console.log('hi');
        const { productID, name, price, imageData } = req.body;
        const userEmail = req.params.userEmail; // ✅ (not req.params.id)

        console.log(req.body, userEmail, "hello");

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
    const userEmail = req.params.userEmail; // Using userEmail instead of userId

    try {
        const carts = await CartModel.find({ userEmail });
        res.status(200).json(carts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cart items.' });
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

// 🚚 Get Delivery Info
const getDelivery = async (req, res) => {
    const userEmail = req.params.userEmail;

    try {
        const cart = await CartModel.findOne({ userEmail });
        if (!cart) {
            return res.status(200).json({
                receiverPhoneNumber: "No phone number set",
                deliveryAddress: "No address set"
            });
        }
        res.status(200).json({
            receiverPhoneNumber: cart.receiverPhoneNumber || "No phone number set",
            deliveryAddress: cart.deliveryAddress || "No address set"
        });
    } catch (error) {
        console.error('Error fetching delivery info:', error);
        res.status(500).json({ message: 'Error fetching delivery information' });
    }
};

const updateDelivery = async (req, res) => {
    const userEmail = req.params.userEmail;
    const { receiverPhoneNumber, deliveryAddress } = req.body;

    try {
        const result = await CartModel.updateMany(
            { userEmail },
            { 
                $set: { 
                    receiverPhoneNumber, 
                    deliveryAddress,
                    updatedAt: new Date()
                } 
            }
        );

        if (result.matchedCount === 0) {
            // If no cart exists, create a new one with delivery details
            const newCart = new CartModel({
                userEmail,
                receiverPhoneNumber,
                deliveryAddress
            });
            await newCart.save();
        }

        res.status(200).json({ 
            message: 'Delivery information updated successfully',
            receiverPhoneNumber,
            deliveryAddress
        });
    } catch (error) {
        console.error('Error updating delivery info:', error);
        res.status(500).json({ message: 'Error updating delivery information' });
    }
};

module.exports = {
    createCart,
    getCart,
    getSingleCart,
    updateCart,
    deleteCart,
    getDelivery,    // Add this
    updateDelivery
};
