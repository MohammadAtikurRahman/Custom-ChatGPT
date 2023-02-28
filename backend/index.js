require("dotenv").config();
const express = require("express");

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());


const {getInformation} = require("./controllers/InformationController")

app.post("/api/",getInformation);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});

module.exports = {
};
