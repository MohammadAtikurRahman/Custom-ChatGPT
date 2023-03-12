require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const fs = require("fs");
const csv = require("csv-parser");
const { prop_weight } = require("./InformationController");

// console.log("outside delivery information  "+prop_weight);

let deliveryDataArray = [];
fs.createReadStream("delivery.csv")
  .pipe(csv())
  .on("data", (data) => {
    deliveryDataArray.push(data);
  })
  .on("end", () => {
    console.log("Delivery CSV file processed.");
    processData(deliveryDataArray);
    // console.log(deliveryDataArray); // Print the deliveryDataArray here
  });
const processData = (data) => {
  // console.log(data);
};

async function getPriceInformation(req, res) {

 
}

module.exports = {
  getPriceInformation,
};
