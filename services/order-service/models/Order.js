const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true
    },
    restaurantId: {
        type: String,
        required: true
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Preparing', 'On the Way', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cod'],
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);