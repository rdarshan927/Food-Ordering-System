const Order = require("../models/Order");

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { customerId, restaurantId, items, totalAmount, status, paymentMethod, deliveryAddress } = req.body;
        
        console.log('Received order data:', JSON.stringify(req.body, null, 2));

        // Validate required fields
        if (!customerId || !restaurantId || !items || !totalAmount || !paymentMethod || !deliveryAddress) {
            console.log('Missing required fields:', {
                customerId: !!customerId,
                restaurantId: !!restaurantId,
                items: !!items,
                totalAmount: !!totalAmount,
                paymentMethod: !!paymentMethod,
                deliveryAddress: !!deliveryAddress
            });
            
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['customerId', 'restaurantId', 'items', 'totalAmount', 'paymentMethod', 'deliveryAddress'],
                received: {
                    customerId,
                    restaurantId,
                    items: Array.isArray(items) ? `${items.length} items` : typeof items,
                    totalAmount,
                    paymentMethod,
                    deliveryAddress
                }
            });
        }

        // Validate items structure
        if (!Array.isArray(items) || !items.every(item => 
            item.name && 
            typeof item.price === 'number' && 
            typeof item.quantity === 'number')) {
            return res.status(400).json({
                error: 'Invalid items structure',
                required: {
                    name: 'string',
                    price: 'number',
                    quantity: 'number'
                },
                received: items
            });
        }

        const newOrder = new Order({
            customerId,
            restaurantId,
            items,
            totalAmount,
            paymentMethod,
            deliveryAddress,
            status: status || 'Pending'
        });

        const savedOrder = await newOrder.save();
        console.log('Order saved successfully:', savedOrder._id);
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            error: 'Failed to create order',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Get all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get orders by customer email
exports.getOrdersByCustomerEmail = async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!id) {
            return res.status(400).json({ message: "Customer email is required" });
        }
        
        // Find all orders where customerId matches the email
        const orders = await Order.find({ customerId: id }).sort({ createdAt: -1 });
        
        if (orders.length === 0) {
            return res.status(200).json({ message: "No orders found for this customer", orders: [] });
        }
        
        res.json(orders);
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.status(500).json({ 
            error: 'Failed to fetch customer orders',
            message: error.message 
        });
    }
};

// Update order
exports.updateOrder = async (req, res) => {
    try {
        const { customerId, restaurantId, items, totalAmount, status } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.customerId = customerId;
        order.restaurantId = restaurantId;
        order.items = items;
        order.totalAmount = totalAmount;
        order.status = status;
        order.paymentMethod = paymentMethod;       
        order.deliveryAddress = deliveryAddress;           
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        await order.deleteOne();
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};