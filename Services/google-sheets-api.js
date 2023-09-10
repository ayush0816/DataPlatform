const { google } = require("googleapis");
// const dotenv = require("dotenv");

// dotenv.config();

const sheets = google.sheets("v4");
const auth = new google.auth.JWT(
  "dataplatform@focal-lens-398611.iam.gserviceaccount.com",
  null,
  "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3SAjo1YLYhBCb\n7v2+VRYvYswzIa5ch65CBJpXKLab/irO+wkb3mncOg95JSEk1OetzabZDTjrqWdY\nzCTjz+AMf0ynFjl6yS5Ixrmwy5E67aWs/XdZVkN/TEe2lNFHJDFrziM7iJXk/txD\nmtDL7+TQdcvLKRJTAaLHSXc3kethmoToZ96FNMoPGnJyqGFU5eUMMJmP9ojTJkRH\nnoNlEGL5eSJAoQHqlG0RcXTQ78e5buZf2geOYPWTKx1LetMYzjpxnfEggwAWom29\nWRiROKyHTZ1o6UZ486JbhKwcI4oMVuYop8E3nJj9XyEqIe+tm03eO0S0U2U3vCkL\nyVlaJp8lAgMBAAECggEAELrTEV8X6/1Av4hqV1rQmm+0FatqjTNXXTBVXu+uR4FF\nABKwa1T7KGk7q1e6dZsM23O3r1KtJ5nAKhNW/10kuuSjJxH4xN6jSm0ABdrMaBV0\nN4ewGBKvOOn0wSjxYhiJfakvKcqBwDQ2qoxxqFk+nialJ7zD2Zl/IHNyHeZEbEAK\nMjqpuNttYLXzRJsl1ejekWTJKIAJxtjrtj90i2L4LKPnpEdQPqWghnavwcxl4S+a\nAqhV9y1LUFpshPtr30KbVjAg89PLh6hbp1kplkCcfbFuGoo+MFZYg97WE98bb+AD\nsdA1IcgQ8t6/2xgpOg7kGTD2rjN+V+BdKJ16DkIRywKBgQD0YShBQ2ab6EBI1HTe\n2+ZwXSOuRtOIkeAIyApaCXG9vcFrNHpCkP5XkKdkUuGExipFsJv95aPv/CAeht2D\nWRCzphVrruZ1NVSAkkOvVMhQk5yh3ITdK0itWD5sm6rpMrOskgxs3RiWXE7QjR1M\nNrLJINRLNN2LpyeaWUusU7rFmwKBgQC//yCTmVrwzQVe+sDwUJzz0fn82sb31Fkw\nA+eMEZXy0/8Gq/7XWEA5mltRmMYafC5CbVbYhFhoH6qbgv4eEmIhBMWElSmgLd/i\nCko+LMK/k8eHh0VKWIHnFqF3I6S21SrvgVenQpBjpUNogZKALb9EArfwXl25+ziK\nvzARrF7aPwKBgQCrJegVXOjdw5hR6Uk4UvVeODym7z9yZAds3vww9nBMHDr7o7ME\nL5uRI+O3pTv/yvEMAZYeCNf5WK/98SHtvVCvIF/cHI+WApV9vfHdNxlbJSYLTe9X\nHds2W5jMY3EdBL9E2rwM+gMgOuGPuWSNXbl0lqNXUFzgU16vAF64/6LMhQKBgQCh\nFiN08zQT2VBqUiTS/C/TehcuiThq8qUp3fzFznNq22ebZ29XqlmoetOncHC2A/6k\nCSzWWKP8KKVx+MPQ40elwGUgSi40kIjJFC0aYV+8cPb1xQ7jw8Kp6pjqZuNp6wwt\nCu5KDVUr5Zra8evC058oJsfBSsuEoTzdXG+uRFsI7QKBgBxs1X0r9unk826gMzUt\naUrBR/1S40UAuhD/MGsAVqnEAOLSNj7mAoqgdKIoJAgMqvU0CaWwz/Lw/3XD0hUi\n9LOBdFOgPJJkHWcbtopN9haWBHdDfhLV60cL5ehLYZPChS5wCx7LYBJEKW9qi/Fm\n/uflfvTdMI4badXPSqiJqUO0\n-----END PRIVATE KEY-----\n",
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
