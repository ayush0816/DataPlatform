const express = require("express");
const db = require("./database/db");
const cors = require("cors");

const port = 8081;
const app = express();

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`kudos! App is up and running at port : ${port}`);
});
