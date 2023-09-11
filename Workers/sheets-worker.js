const amqp = require("amqplib");

const googleSheets = require("../Services/google-sheets-api"); // Import your Google Sheets module
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/../config/config.env" });

async function consumeSheets() {
  try {
    const connection = await amqp.connect(process.env.rabbitMQUrl);
    const channel = await connection.createChannel();
    const queueName = "google-sheets-queue"; // Change this to your queue name

    // await channel.assertQueue(queueName, { durable: true });
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
        console.error("Error processing message:", error);

        // Handle errors, you might want to retry or log the error
        // Note: In production, you should implement better error handling and retries
      }
    });
  } catch (error) {
    console.error("Error connecting to the queue:", error);
  }
}

module.exports = {
  consumeSheets,
};
