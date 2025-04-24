const amqp = require("amqplib");

let channel;

const connectRabbit = async () => {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue("driver_registered");
};

const publishDriverRegistered = async (driverData) => {
    console.log(driverData, "Driver data")
  if (!channel) await connectRabbit();
  channel.sendToQueue("driver_registered", Buffer.from(JSON.stringify(driverData)));
};

module.exports = { publishDriverRegistered };
