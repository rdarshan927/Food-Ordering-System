const { getChannel } = require('../config/rabbitmq');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');

const startNotificationConsumer = async () => {
  const channel = getChannel();
  const QUEUE = 'notificationQueue';

  await channel.assertQueue(QUEUE, { durable: true });

  channel.consume(QUEUE, async (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());

      const { email, subject, message } = data;

      try {
        // 1. Save in MongoDB
        await Notification.create({ email, subject, message });

        // 2. Send Email
        await sendEmail({ to: email, subject, text: message });

        console.log(`✅ Notification sent to ${email}`);

        channel.ack(msg);
      } catch (error) {
        console.error('❌ Error processing notification:', error);
        channel.nack(msg, false, false); // drop message if failed
      }
    }
  });
};

module.exports = startNotificationConsumer;
