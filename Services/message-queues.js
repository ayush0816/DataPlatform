const amqp = require('amqplib');

// RabbitMQ server URL
const rabbitMQUrl = 'amqp://localhost'; // Replace with your RabbitMQ server URL

const sendMessageToQueue = async (queueName, message) =>{
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();
    
    // await channel.assertQueue(queueName, { durable: true });
    
    // Send the message to the queue
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log('Message sent to queue:', message);
    
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error sending message to queue:', error);
    throw new Error('Failed to send message to queue');
  }
}

module.exports = {
  sendMessageToQueue,
};
