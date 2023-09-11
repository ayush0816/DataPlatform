const { google } = require("googleapis");
const dotenv = require("dotenv");
dotenv.config({ path : __dirname + "/../config/config.env" });

const sheets = google.sheets("v4");
const auth = new google.auth.JWT(
  process.env.CLIENT_ID,
  null,
  process.env.PRIVATE_KEY,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

// Function to add a new row to the Google Sheets document
const addRowToSheet = async (spreadsheetId, range, values) => {
  try {
    const sheetsResponse = await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values,
      },
    });
    return sheetsResponse.data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addRowToSheet,
};
