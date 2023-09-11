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
    // Get the formId from parameters
    const { formId } = req.params;
    // Get the userId from middleware 
    const { userId } = req; 
    const { answers } = req.body;

    // Check for user
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Add the respnse to db
    const response = new Response({ formId, userId });
    const savedResponse = await response.save();
    const rowData = [];

    for (const answerData of answers) {
      const { queId, text } = answerData;

      //Find the ques from the form
      const question = await Question.findOne({ _id: queId });

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      //Provide the answer and link it to response and the ques using their IDs
      const answer = new Answer({
        resId: response._id, 
        queId,
        text,
      });

      await answer.save();

      //Push the mapped ques -> ans values to a 2-D arr
      rowData.push([question.text, answer.text]);
    }

    // Specify spreadsheetId and range where data needs to be added
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = "Sheet1"; 

    const message = {
      spreadsheetId,
      range,
      rowData,
    };

    //Sending the message to message Queue
    await sendMessageToQueue("google-sheets-queue", message ,{
      maxRetries: 3, 
      dlq: 'sheetsDLQ', 
    });

    // Consuming the messages from the queues
    consumeSheets();

    // Getting the customer phone from the body
    const { custPhone } = req.body;

    // Call the sendSMS function from the smsService module
    const smsResult = await smsService.sendSMS(custPhone, user.name, rowData, {
      maxRetries: 3, // Maximum retry count for sending the message
      dlq: "smsDLQ", 
    });

    //Consuming the messages from the queue
    consumeSMSQueue();

    res.json({ savedResponse, smsResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addres };
