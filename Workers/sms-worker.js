// smsWorker.js

const amqp = require("amqplib");
const twilio = require("twilio");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/../config/config.env" });

// Twilio configuration
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const twilioPhoneNumber = process.env.twilioPhoneNumber;
const client = twilio(accountSid, authToken);

// RabbitMQ server URL
const rabbitMQUrl = "amqp://localhost"; // Replace with your RabbitMQ server URL

const consumeSMSQueue = async () => {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    const queueName = "smsQueue"; // Replace with the correct name of your RabbitMQ queue

    // await channel.assertQueue(queueName, { durable: true });
    console.log(`Worker is waiting for messages in ${queueName}.`);

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const { customerPhone, message } = JSON.parse(msg.content.toString());

        try {
          // Send the SMS using Twilio
          await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: customerPhone,
          });

          console.log("SMS sent:", message);
        } catch (error) {
          console.error("Error sending SMS:", error.message);

          const retryCount = msg.properties.headers["x-retry-count"];
          const maxRetries = msg.properties.headers["x-max-retries"];
          const dlqName = msg.properties.headers["x-dlq"];

          if (retryCount < maxRetries) {
            // Increase the retry count
            msg.properties.headers["x-retry-count"] += 1;

            // Re-enqueue the message with the same delay
            channel.sendToQueue(queueName, msg.content, msg.properties);
          } else if (dlqName) {
            // Max retries reached, move to the DLQ
            channel.sendToQueue(dlqName, msg.content, msg.properties);
          }
        }

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
    throw new Error("Failed to consume messages from the queue");
  }
};

// consumeSMSQueue();

module.exports = {
  consumeSMSQueue,
};
