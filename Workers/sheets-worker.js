const amqp = require("amqplib");

const googleSheets = require("../Services/google-sheets-api"); // Import your Google Sheets module
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/../config/config.env" });

async function consumeSheets() {
  try {
    const connection = await amqp.connect(process.env.rabbitMQUrl);
    const channel = await connection.createChannel();
    const queueName = "google-sheets-queue"; // Change this to your queue name

    await channel.assertQueue(queueName, { durable: true });
    console.log(`Worker connected to the queue: ${queueName}`);

    channel.consume(queueName, async (message) => {
      console.log(message);
      const content = JSON.parse(message.content.toString());

      try {
        // Process the message and send data to Google Sheets
        const { spreadsheetId, range, rowData } = content;

        const sheetsResponse = await googleSheets.addRowToSheet(
          spreadsheetId,
          range,
          rowData
        );

        console.log("Data sent to Google Sheets:", sheetsResponse);

        // Acknowledge the message to remove it from the queue
        channel.ack(message);
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
    });
  } catch (error) {
    console.error("Error connecting to the queue:", error);
  }
}

module.exports = {
  consumeSheets,
};
