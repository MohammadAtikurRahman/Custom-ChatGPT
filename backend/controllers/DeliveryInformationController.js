require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const fs = require("fs");
const csv = require("csv-parser");






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


async function getDeliveryInformation(req, res){


    const message = req.body.message;
    
    const bayOfPlentyData = deliveryDataArray.filter(
      (d) => d.location === message
    );

    const deliveryPrices = bayOfPlentyData.reduce(
      (acc, d) => {
        const price = parseFloat(d.deliveryPrice);
        if (!isNaN(price)) {
          // check if price is a valid number
          if (price < acc.minPrice) {
            acc.minPrice = price;
          }
          if (price > acc.maxPrice) {
            acc.maxPrice = price;
          }
        }
        return acc;
      },
      { minPrice: Infinity, maxPrice: -Infinity }
    );

    return res.json({
      botResponse:
        "\n\n" +
        "Shipping Charge depends on Product Weight and whether it is Heavy or Fragile. For _" +
        bayOfPlentyData[0].location +
        "  the lowest shipping charge is " +
        deliveryPrices.minPrice +
        " and the Highest Shipping charge is " +
        deliveryPrices.maxPrice +
        ".  what is your area code ?",
    });
  };





module.exports = {
    getDeliveryInformation,
};
  