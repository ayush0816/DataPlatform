// smsService.js

const { sendMessageToQueue } = require("./message-queues");

const sendSMS = async (customerPhone, customerName, response) => {
  try {
    // Compose the SMS message
    console.log(customerName);
    let message = `Hello ${customerName}, thank you for your response:\n`;

    for (let arr of response) {
      message += `Question: ${arr[0]}\nAnswer: ${arr[1]}\n`;
    }

    // Send the message to the message queue
    await sendMessageToQueue("smsQueue", { customerPhone, message });

    console.log("SMS added to the message queue");
    return "SMS added to the message queue";
  } catch (error) {
    console.error("Error:", error.message);
    throw new Error("Failed to add SMS to the message queue");
  }
};

module.exports = {
  sendSMS,
};
