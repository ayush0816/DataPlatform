const Response = require("../Models/response");
const Answer = require("../Models/answer");
const Question = require("../Models/ques");
const UserModel = require("../Models/user");
const googleSheets = require("../Services/google-sheets-api"); // Import the Google Sheets module
const smsService = require("../Services/twilio-sms-api");
const { consumeSMSQueue } = require("../Workers/sms-worker");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/../config/config.env" });
const { sendMessageToQueue } = require("../Services/message-queues");
const { consumeSheets } = require("../Workers/sheets-worker");

const addres = async (req, res) => {
  try {
    const { formId } = req.params;
    const { userId } = req; // Assuming userId is available in the request due to middleware
    const { answers } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const response = new Response({ formId, userId });
    const savedResponse = await response.save();
    const rowData = [];

    for (const answerData of answers) {
      const { queId, text } = answerData;

      const question = await Question.findOne({ _id: queId });

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      const answer = new Answer({
        resId: response._id, // Link the answer to the response using its ID
        queId,
        text,
      });

      await answer.save();
      rowData.push([question.text, answer.text]);
    }

    // Specify your spreadsheetId and range where you want to add the data
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = "Sheet1"; // Set your desired sheet and range

    // Use the Google Sheets module to add the row to the Google Sheet

    const message = {
      spreadsheetId,
      range,
      rowData,
    };
    await sendMessageToQueue("google-sheets-queue", message ,{
      maxRetries: 3, 
      dlq: 'smsDLQ', 
    });

    
    consumeSheets();

    // const sheetsResponse = await googleSheets.addRowToSheet(
    //   spreadsheetId,
    //   range,
    //   rowData
    // );

    const { custPhone } = req.body;

    // Call the sendSMS function from the smsService module
    const smsResult = await smsService.sendSMS(custPhone, user.name, rowData, {
      maxRetries: 3, // Maximum retry count for sending the message
      dlq: "smsDLQ", 
    });
    consumeSMSQueue();

    res.json({ savedResponse, smsResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addres };
