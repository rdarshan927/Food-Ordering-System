const express = require('express');
const connectDB = require('./config/db');
const { connectRabbitMQ } = require('./config/rabbitmq');
const startNotificationConsumer = require('./consumer/notificationConsumer');

const app = express();
require('dotenv').config();

// Connect to Database
// connectDB();

// Connect to RabbitMQ
connectRabbitMQ().then(() => {
  startNotificationConsumer();
});

app.get('/', (req, res) => {
  res.send('Notification Service Running');
});

module.exports = app;
