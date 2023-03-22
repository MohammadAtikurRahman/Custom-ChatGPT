const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");
const { getDeliveryInformation } = require("./DeliveryInformationController");
const stringSimilarity = require("string-similarity");
var sender;

let messageReceiver = "";

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
    // console.log("Delivery CSV file processed.");
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



    const matchesdata = stringSimilarity.findBestMatch(
      message,
      dataArray.map((d) => d.name)
    );
    let matchedItemsdata = [];
    if (matchesdata.bestMatch.rating > 0.3) {
      const matchedItemdata = dataArray[matchesdata.bestMatchIndex];
      matchedItemsdata.push(matchedItemdata);
    } else {
      console.log("No match found");
    }
    // console.log("matched item:", matchedItems[0]);
    const search_result = matchedItemsdata[0];


     console.log("search result",search_result)




    const matchingData1 = search_result && message.includes("dimension")
    


    const matchingData2 = dataArray.find((d) => d.name === message);

    console.log("matching data2",matchingData2)


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
    }  if (matchingData1) {
      const dimensions = {
        width: search_result.width,
        height: search_result.height,
        length: search_result.length,
      };
      res.status(200).json({
        botResponse: `\n\nWidth: ${dimensions.width}, Height: ${dimensions.height}, Length: ${dimensions.length}`,
      });
      return;
    }

    const matches = stringSimilarity.findBestMatch(
      message,
      dataArray.map((d) => d.name)
    );
    let matchedItems = [];
    if (matches.bestMatch.rating > 0.3) {
      const matchedItem = dataArray[matches.bestMatchIndex];
      matchedItems.push(matchedItem);
    } else {
      console.log("No match found");
    }
    // console.log("matched item:", matchedItems[0]);
    const itemName = matchedItems[0];




    console.log("%cFuzzy Search is happening " + itemName?.name, "color: yellow");
















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


    console.log("queries", queries)

    if (queries.length === 0) {
      //call to the deliveryu
      return tiggerDetaile();
    }
  
  
  // have to coded here
    const result = queries
      .map((q) => {
        const data = dataArray.find((d) => d.name === itemName.name);
        if (!data || !data[q.property]) {
          return null;
        }
        return { [q.name]: data[q.property] };
      })
      .filter((r) => r !== null);





    // console.log("result data", result);
    if (result.length === 0) {
      return res.status(400).json({ error: "No matching data found" });
    }

    // console.log("result zero", result[0]);

    if (result[0].hasOwnProperty("price")) {
      const prop_weight = itemName.weight;
      const prop_price = itemName.price;
      // console.log("Price", prop_price);
      // console.log("Weight", prop_weight);

      // Call tiggerDetaile with prop_weight
      tiggerDetaile(prop_weight, prop_price);

      return;
    }

    function tiggerDetaile(prop_weight, prop_price) {
      // console.log("successfully get the weight", prop_weight);
      // console.log("successfully get the price", prop_price);

      if (message) {

        try {
          const message = req.body.message;
          console.log("the message", message);

          // Use a regular expression to match and extract the desired part of the message, excluding the price
          const shippingRegex = /(Shipping - [^-]*?)(?=\sprice|$)/i;
    
          const match = message.match(shippingRegex);
          if (match) {
            messageReceiver = match[1].trim();
            console.log("messageReceiver", messageReceiver);
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

          if (
            deliveryPrices.minPrice !== null &&
            deliveryPrices.minPrice !== undefined &&
            deliveryPrices.minPrice !== "" &&
            !isNaN(deliveryPrices.minPrice) &&
            deliveryPrices.minPrice !== Infinity
          ) {


            const numPropWeight = Number(prop_weight);


            const saver = getDeliveryPrice(messageReceiver, numPropWeight);

            function getDeliveryPrice(location, weight) {
              // console.log("inside the weigh", weight);
              // Find the delivery rule that matches the location and weight
              const deliveryRule = deliveryDataArray.find((rule) => {
                return (
                  rule.location === location &&
                  ((rule.operator === "<" && weight < rule["weight-dl"]) ||
                    (rule.operator === "=" && weight == rule["weight-dl"]))
                );
              });

              // If a matching rule was found, return the delivery price
              if (deliveryRule) {
                return deliveryRule.deliveryPrice;
              } else {
                return `No delivery price found for location ${location} and weight ${weight}`;
              }
            }

            // console.log("weight ", prop_weight);

            // console.log("delivery charge ", saver);
            // console.log("base price ", prop_price);
            const numSaver = Number(saver);
            const numPropPrice = Number(prop_price);

            const final_result = numSaver + numPropPrice;
            // console.log(final_result); // Output: 120

            return res.json({
              botResponse:
                "\n\n" +itemName.name +
                "Shipping Charge depends on Product Weight and whether it is Heavy or Fragile. For " +
                bayOfPlentyData[0]?.location +
                "  the lowest shipping charge is " +
                deliveryPrices.minPrice +
                " and the Highest Shipping charge is " +
                deliveryPrices.maxPrice +
                " . basic price is " +
                prop_price +
                " based with weight the delivery charge " +
                saver +
                " your final price is " +
                final_result,
            });
          } else if (message) {
            res.json({
              botResponse:
                "\n\n" + itemName.name+
                "Shipping Charge depends on Product Weight and location and whether it is Heavy or Fragile." +
                "Basic price " +
                prop_price +
                " here weight charged will be added based on location. What is your location or area code?",
            });
          }
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
