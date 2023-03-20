const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");
const { getDeliveryInformation } = require("./DeliveryInformationController");

let dataArray = [];
fs.createReadStream("idiya.csv")
  .pipe(csv())
  .on("data", (data) => {
    dataArray.push(data);
  })
  .on("end", () => {
    processData(dataArray);
  });
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
var prop_weight;
async function getInformation(req, res) {
  const message = req.body.message;

  const properties = [
    { name: "name", property: "name" },
    { name: "sku", property: "sku" },
    { name: "price", property: "price" },
    { name: "brand", property: "brand" },
    { name: "quantity", property: "quantity" },
    { name: "width", property: "width" },
    { name: "height", property: "height" },
    { name: "length", property: "length" },
    { name: "weight", property: "weight" },
    { name: "description", property: "description" },
  ];

  for (const prop of properties) {
    const matchingData1 = dataArray.find(
      (d) => message.includes(d.name) && message.includes("dimension")
    );
    const matchingData2 = dataArray.find((d) => d.name === message);

    const matchingData3 = dataArray.find((d) => d.sku === message);

    if (matchingData2) {
      res.json({
        botResponse: `\n\n${matchingData2.name} of : ${matchingData2.description}
          }`,
      });
      return;
    } else if (matchingData3) {
      res.json({
        botResponse: `\n\n${matchingData3.name} of : ${matchingData3.description}
          }`,
      });
      return;
    } else if (matchingData1) {
      const dimensions = {
        width: matchingData1.width,
        height: matchingData1.height,
        length: matchingData1.length,
      };
      res.status(200).json({
        botResponse: `\n\nWidth: ${dimensions.width}, Height: ${dimensions.height}, Length: ${dimensions.length}`,
      });
      return;
    }

    const itemName = dataArray.find((d) => message.includes(d.name));

    if (!itemName) {
      try {
        const API_KEY = process.env.OPENAI_API_KEY;
        const response = await axios({
          method: "post",
          url: "https://api.openai.com/v1/engines/text-davinci-003/completions",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          data: {
            prompt: message,
            max_tokens: 100,
            n: 1,
            stop: "",
            temperature: 0.5,
          },
        });
        return res.json({ botResponse: "\n" + response.data.choices[0].text });
      } catch (error) {
        return res
          .status(500)
          .send({ error: "Could not generate text completion" });
      }
    }

    const queries = properties.filter((p) => message.includes(p.name));

    if (queries.length === 0) {
      //call to the deliveryu
      return tiggerDetaile();
    }
    const result = queries
      .map((q) => {
        const data = dataArray.find((d) => d.name === itemName.name);
        if (!data || !data[q.property]) {
          return null;
        }
        return { [q.name]: data[q.property] };
      })
      .filter((r) => r !== null);
    if (result.length === 0) {
      return res.status(400).json({ error: "No matching data found" });
    }

    console.log("result zero", result[0]);

    if (result[0].hasOwnProperty("price")) {
      let prop_weight = itemName.weight;
      let prop_price = itemName.price;
      console.log("Price", prop_price);
      console.log("Weight", prop_weight);

      // Call tiggerDetaile with prop_weight
      tiggerDetaile(prop_weight, prop_price);

      return;
    }

    function tiggerDetaile(prop_weight, prop_price) {
      console.log("successfully get the weight", prop_weight);
      console.log("successfully get the price", prop_price);

      if (message) {
        console.log("test");

        try {
          const message = req.body.message;
          console.log("the message", message);
          
          // Use a regular expression to match and extract the desired part of the message
          const shippingRegex = /Shipping - .*/;
          const match = message.match(shippingRegex);
          
          if (match) {
            var messageReceiver = match[0];
            console.log("messageReceiver", messageReceiver);
          } else {
            console.log("No shipping information found in the message");
          }
          

          const bayOfPlentyData = deliveryDataArray.filter(
            (d) => d.location === messageReceiver
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

          res.json({
            botResponse:
              "\n\n" +
              "Shipping Charge+++++ depends on Product Weight and whether it is Heavy or Fragile. For _" +
              bayOfPlentyData[0]?.location +
              "  the lowest shipping charge is " +
              deliveryPrices.minPrice +
              " and the Highest Shipping charge is " +
              deliveryPrices.maxPrice +
              ".  what is your location ?",
          });
        } catch (error) {
          console.error(error);
          res.status(500).send("Internal Server Error");
        }
      } else {
        res.json({
          botResponse: "\n\n" + "What is your location?",
        });
      }
    }

    const response = result.reduce((prev, curr) => {
      return prev + ` ${Object.keys(curr)[0]}: ${curr[Object.keys(curr)[0]]} `;
    }, "");

    return res.json({ botResponse: `\n\n` + response });
  }
}

module.exports = {
  getInformation,
};
