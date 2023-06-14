const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");
const { getDeliveryInformation } = require("./DeliveryInformationController");
const util = require("util");

const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "database.csv",
  header: [
    { id: "message", title: "Message" },
    { id: "price", title: "Price" },
    { id: "shipping", title: "Shipping" },
  ],
});

var userInfo = {};

let dataArray = [];
fs.createReadStream("idiya.csv")
  .pipe(csv())
  .on("data", (data) => {
    dataArray.push(data);
  })
  .on("end", () => {
    processData(dataArray);
  });

var deliveryPath = [];
let dates = [];

let routes = {};

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (row) => {
    // Split the "ddate" string into an array of dates
    let assignedDates = row["ddate"]
      .split("\n")
      .filter((date) => date.trim() !== "");

    // If the route does not exist in routes, initialize it
    if (!routes[row["route"]]) {
      routes[row["route"]] = {
        route: row["route"],
        postcode: [],
        ddate: [],
      };
    }

    // Push the current postcode to the postcodes array for the route, only if it's not empty
    if (row["postcode"].trim() !== "") {
      routes[row["route"]].postcode.push(row["postcode"]);
    }

    // Push all non-empty assigned dates to the ddates array for the route
    if (assignedDates.length > 0) {
      routes[row["route"]].ddate.push(...assignedDates);
    }
  })
  .on("end", () => {
    // Convert routes to an array of route objects
    deliveryPath = Object.values(routes);

    // console.log(deliveryPath);
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
    { name: "delivery", property: "delivery" },
    { name: "code", property: "code" },
    { name: "area", property: "area" },
    { name: "region", property: "region" },
    { name: "rural", property: "rural" },
    { name: "charge", property: "charge" },

  ];

  for (const prop of properties) {
    const matchingData1 = dataArray.find(
      (d) => message.includes(d.name) && message.includes("dimension")
    );

    const matchingData2 = dataArray.find((d) => d.name === message);

    const matchingData3 = dataArray.find((d) => d.sku === message);

    const areaTocharge = dataArray.find((d) => d.area === message);
    console.log("area to charge", areaTocharge);

  
    const codeTocharge = dataArray.find((d) => d.code === message);

    const areaTo_delivery = deliveryPath.find((d) => message.includes(d.route));
    console.log("area head of delivery",areaTo_delivery)

    const areaTo_code = deliveryPath.find((path) => path.postcode.some(code => message.includes(code)));

    // If areaTo_code is found, log it. Otherwise, log a not found message.
    if(areaTo_code) {
        console.log("Found route: ", areaTo_code.route);
        console.log("Associated postcodes: ", areaTo_code.postcode);
    } else {
        console.log("Postcode not found in any route.");
    }


    //  const areaTo_charge = deliveryPath.find((d) => d.postcode.toLowerCase() === message.toLowerCase() || message.toLowerCase().includes(d.postcode.toLowerCase()));
    //  console.log("area to charge", areaTo_charge);


    const pData = fs.readFileSync("post.json", "utf8");
    const parsedData = JSON.parse(pData);
    const rdata = parsedData.botResponse;
    console.log("rdata",rdata)

    if (matchingData2) {
      res.json({
        botResponse: `\n\n${matchingData2.name} of : ${matchingData2.description}`,
      });
      return;
    } else if (matchingData3) {
      res.json({
        botResponse: `\n\n${matchingData3.name} of : ${matchingData3.description}`,
      });
      return;
    }

    // else if (codeTocharge) {
    //   res.json({
    //     botResponse: `\n\n${codeTocharge.code} of : ${codeTocharge.charge}`,
    //   });
    //   return;
    // }
    else if (matchingData1) {
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
    
    
    
    
    else if (areaTo_delivery) {
      // Convert the strings in ddates to Date objects
      let deliveryDates = areaTo_delivery.ddate.map((date) => new Date(date));

      // Get today's date at midnight for comparison
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      // Filter for dates that are today or in the future
      let futureDates = deliveryDates.filter((date) => date >= today);

      // Sort the dates in ascending order
      futureDates.sort((a, b) => a - b);

      // Take the next 3 dates
      let nextThreeDates = futureDates.slice(0, 3);

      // Convert the dates back to strings in the format YYYY-MM-DD
      nextThreeDates = nextThreeDates.map(
        (date) => date.toISOString().split("T")[0]
      );

      res.json({
        botResponse: `\n\n Yes we ship to ${
          areaTo_delivery.route
        } and Our next delivery dates are : ${nextThreeDates.join(", ")}`,
      });
      return;
    }


 

    else if (areaTo_code &&  message.includes("shipp") || message.includes("shipped")  ) {

      console.log("happen here",areaTo_code)

      // Convert the strings in ddates to Date objects
      let deliveryDates = areaTo_code.ddate.map((date) => new Date(date));

      // Get today's date at midnight for comparison
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      // Filter for dates that are today or in the future
      let futureDates = deliveryDates.filter((date) => date >= today);

      // Sort the dates in ascending order
      futureDates.sort((a, b) => a - b);

      // Take the next 3 dates
      let nextThreeDates = futureDates.slice(0, 3);

      // Convert the dates back to strings in the format YYYY-MM-DD
      nextThreeDates = nextThreeDates.map(
        (date) => date.toISOString().split("T")[0]
      );

      res.json({
        botResponse: `\n\n Yes we ship to ${
          areaTo_code.route
        } and Our next delivery dates are : ${nextThreeDates.join(", ")}`,
      });


      fs.writeFileSync("post.json", JSON.stringify({}));

      return;
    }
  
    else if (areaTo_code && rdata  ) {

      console.log("happen here",areaTo_code)

      // Convert the strings in ddates to Date objects
      let deliveryDates = areaTo_code.ddate.map((date) => new Date(date));

      // Get today's date at midnight for comparison
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      // Filter for dates that are today or in the future
      let futureDates = deliveryDates.filter((date) => date >= today);

      // Sort the dates in ascending order
      futureDates.sort((a, b) => a - b);

      // Take the next 3 dates
      let nextThreeDates = futureDates.slice(0, 3);

      // Convert the dates back to strings in the format YYYY-MM-DD
      nextThreeDates = nextThreeDates.map(
        (date) => date.toISOString().split("T")[0]
      );

      res.json({
        botResponse: `\n\n Yes we ship to ${
          areaTo_code.route
        } and Our next delivery dates are : ${nextThreeDates.join(", ")}`,
      });


      fs.writeFileSync("post.json", JSON.stringify({}));

      return;
    }

    const weightData = fs.readFileSync("weight.json", "utf8");
    const parsedWeightData = JSON.parse(weightData);
    const retrievedWeight = parsedWeightData.weight;
    const retrievedPrice = parsedWeightData.price;

    if (
      (message.includes("Shipping") && retrievedWeight && retrievedPrice) ||
      codeTocharge
    ) {
      const weightData = fs.readFileSync("weight.json", "utf8");
      const parsedWeightData = JSON.parse(weightData);
      const retrievedWeight = parsedWeightData.weight;
      const priceData = fs.readFileSync("weight.json", "utf8");
      const parsedPriceData = JSON.parse(priceData);
      const retrievedPrice = parsedPriceData.price;
      const printconvertedint = parseInt(retrievedPrice?.trim(), 10);

      if (codeTocharge?.code) {
        var deliveryPrice = getDeliveryPrice(
          codeTocharge.delivery,
          retrievedWeight
        );
      } else {
        deliveryPrice = getDeliveryPrice(message, retrievedWeight);
      }

      const convertedintdelivery = parseInt(deliveryPrice?.trim(), 10);
      const total_price = printconvertedint + convertedintdelivery;

      function getDeliveryPrice(location, weight) {
        const deliveryRule = deliveryDataArray.find((rule) => {
          return (
            rule.location === location &&
            ((rule.operator === "<" && weight < rule["weight-dl"]) ||
              (rule.operator === "=" && weight == rule["weight-dl"]))
          );
        });

        if (deliveryRule) {
          return deliveryRule.deliveryPrice;
        } else {
          return `No delivery price found for location ${location} and weight ${weight}`;
        }
      }

      if (codeTocharge?.charge == "39" && retrievedPrice !== undefined) {
        const rural_charge = codeTocharge.charge;
        const conv_rural_charge = parseInt(rural_charge?.trim(), 10);

        const fragile_charge = parseInt( codeTocharge.fragile?.trim(),10);

        console.log("fragile charge",fragile_charge)



      

        if(fragile_charge){    
        const response = {
          botResponse: `\n\nPppppprice ${retrievedPrice} For Weight ${retrievedWeight} Deliver Charge ${deliveryPrice} for rural area extra charge added ${
            codeTocharge.charge
          }  and also added here fragile charge ${fragile_charge} and Total Price ${total_price + conv_rural_charge+fragile_charge}`,
        };
        fs.writeFileSync("weight.json", JSON.stringify({}));

        return res.json(response);
      }else {
        const response = {
          botResponse: `\n\nPppppprice ${retrievedPrice} For Weight ${retrievedWeight} Deliver Charge ${deliveryPrice} for rural area extra charge added ${
            codeTocharge.charge
          }  and Total Price ${total_price + conv_rural_charge}`,
        };
        fs.writeFileSync("weight.json", JSON.stringify({}));

        return res.json(response);
      }

        // Write an empty JSON object to weight.json
        
      }

      if (codeTocharge?.charge == "39" && retrievedPrice === undefined) {
        const rural_charge = codeTocharge.charge;
        const conv_rural_charge = parseInt(rural_charge?.trim(), 10);

        const response = {
          botResponse: `\n\n What is you product name ?`,
        };

        // Write an empty JSON object to weight.json
        fs.writeFileSync("weight.json", JSON.stringify({}));

        return res.json(response);
      }

      if (codeTocharge?.charge == "0" && retrievedPrice !== undefined) {
        const rural_charge = codeTocharge.charge;
        const conv_rural_charge = parseInt(rural_charge?.trim(), 10);

        const response = {
          botResponse: `\n\nPrice ${retrievedPrice} For Weight ${retrievedWeight} Deliver Charge ${deliveryPrice}  Total Price ${total_price}`,
        };

        // Write an empty JSON object to weight.json
        fs.writeFileSync("weight.json", JSON.stringify({}));

        return res.json(response);
      }

      if (codeTocharge?.charge == "0" && retrievedPrice === undefined) {
        const rural_charge = codeTocharge.charge;
        const conv_rural_charge = parseInt(rural_charge?.trim(), 10);

        const response = {
          botResponse: `\n\n What is you product name ?`,
        };

        // Write an empty JSON object to weight.json
        fs.writeFileSync("weight.json", JSON.stringify({}));

        return res.json(response);
      }

      // if(codeTocharge?.charge == "undifined")
      else {
        const response = {
          botResponse: `\n\nPrice ${retrievedPrice} For Weight ${retrievedWeight} Deliver Charge ${deliveryPrice} Total Price ${total_price}`,
        };

        // Write an empty JSON object to weight.json
        fs.writeFileSync("weight.json", JSON.stringify({}));

        return res.json(response);
      }
    }

    if (
      (message.includes("Shipping") && retrievedWeight && retrievedPrice) ||
      areaTocharge
    ) {


      const weightData = fs.readFileSync("weight.json", "utf8");
      const parsedWeightData = JSON.parse(weightData);
      const retrievedWeight = parsedWeightData.weight;



      const priceData = fs.readFileSync("weight.json", "utf8");



      const parsedPriceData = JSON.parse(priceData);
      const retrievedPrice = parsedPriceData.price;
      const printconvertedint = parseInt(retrievedPrice?.trim(), 10);

      if (areaTocharge?.area) {
        var deliveryPrice = getDeliveryPrice(
          areaTocharge.delivery,
          retrievedWeight
        );
      } else {
        deliveryPrice = getDeliveryPrice(message, retrievedWeight);
      }

      const convertedintdelivery = parseInt(deliveryPrice?.trim(), 10);
      const total_price = printconvertedint + convertedintdelivery;

      function getDeliveryPrice(location, weight) {
        const deliveryRule = deliveryDataArray.find((rule) => {
          return (
            rule.location === location &&
            ((rule.operator === "<" && weight < rule["weight-dl"]) ||
              (rule.operator === "=" && weight == rule["weight-dl"]))
          );
        });

        if (deliveryRule) {
          return deliveryRule.deliveryPrice;
        } else {
          return `No delivery price found for location ${location} and weight ${weight}`;
        }
      }

      if (areaTocharge?.charge == "39" && retrievedPrice !== undefined) {
        const rural_charge = areaTocharge.charge;
        const conv_rural_charge = parseInt(rural_charge?.trim(), 10);

        const response = {
          botResponse: `\n\nPrice ${retrievedPrice} For Weight ${retrievedWeight} Deliver Charge ${deliveryPrice} for rural area extra charge added ${
            areaTocharge.charge
          }  Total Price ${total_price + conv_rural_charge}`,
        };

        // Write an empty JSON object to weight.json
        fs.writeFileSync("weight.json", JSON.stringify({}));

        return res.json(response);
      }

      if (areaTocharge?.charge == "39" && retrievedPrice === undefined) {
        const rural_charge = areaTocharge.charge;
        const conv_rural_charge = parseInt(rural_charge?.trim(), 10);

        const response = {
          botResponse: `\n\n What is your product name?`,
        };

        // Write an empty JSON object to weight.json
        fs.writeFileSync("weight.json", JSON.stringify({}));

        return res.json(response);
      }

      if (areaTocharge?.charge == "0" && retrievedPrice !== undefined) {
        const rural_charge = areaTocharge.charge;
        const conv_rural_charge = parseInt(rural_charge?.trim(), 10);

        const response = {
          botResponse: `\n\nPrice ${retrievedPrice} For Weight ${retrievedWeight} Deliver Charge ${deliveryPrice} Total Price ${total_price}`,
        };

        // Write an empty JSON object to weight.json
        fs.writeFileSync("weight.json", JSON.stringify({}));

        return res.json(response);
      }

      if (areaTocharge?.charge == "0" && retrievedPrice == undefined) {
        const rural_charge = areaTocharge.charge;
        const conv_rural_charge = parseInt(rural_charge?.trim(), 10);

        const response = {
          botResponse: `\n\n What is your product name?`,
        };

        // Write an empty JSON object to weight.json
        fs.writeFileSync("weight.json", JSON.stringify({}));

        return res.json(response);
      }

      // if(codeTocharge?.charge == "undifined")
      else {
        const response = {
          botResponse: `\n\nPrice ${retrievedPrice} For Weight ${retrievedWeight} Deliver Charge ${deliveryPrice} Total Price ${total_price}`,
        };

        // Write an empty JSON object to weight.json
        fs.writeFileSync("weight.json", JSON.stringify({}));

        return res.json(response);
      }
    }

    if (message.includes("Shipping") && !retrievedWeight && !retrievedPrice) {
      const bayOfPlentyData = deliveryDataArray.filter(
        (d) => d.location === message
      );
      if (bayOfPlentyData.length === 0) {
        return;
      }

      // Find the minimum and maximum values of the deliveryPrice property
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

      // Return bot response with highest and lowest deliveryPrice
      return res.json({
        botResponse:
          "\n\n" +
          "Shipping Charge depends on Product Weight and whether it is Heavy or Fragile. For _" +
          bayOfPlentyData[0].location +
          "  the lowest shipping charge is " +
          deliveryPrices.minPrice +
          " and the Highest Shipping charge is " +
          deliveryPrices.maxPrice +
          ".  Please enter here product name",
      });
    }

    const itemName = dataArray.find((d) => message.includes(d.name));

    const queries = properties.filter((p) => message.includes(p.name));

    // if (queries.length === 0) {
    //     try {
    //       const API_KEY = process.env.OPENAI_API_KEY;
    //       const response = await axios({
    //         method: "post",
    //         url: "https://api.openai.com/v1/engines/text-davinci-003/completions",
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${API_KEY}`,
    //         },
    //         data: {
    //           prompt: "message",
    //           max_tokens: 100,
    //           n: 1,
    //           stop: "",
    //           temperature: 0.5,
    //         },
    //       });
    //       return res.json({
    //         botResponse: "\n" + response.data.choices[0].text,
    //       });
    //     } catch (error) {
    //       return res
    //         .status(500)
    //         .send({ error: "Could not generate text completion" });
    //     }

    // }

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
      if (
        message.includes("when") ||
        message.includes("get") ||
        message.includes("date") ||
        message.includes("delivery date")
      ) {
        let prop_weight = parseInt(itemName.weight.trim(), 10);
        let prop_price = itemName.price;
        // const conv_rural_charge = parseInt(rural_charge?.trim(), 10);
    
        console.log(typeof prop_weight);
    
        const response = {
          botResponse: `\n\n What is your postcode?`,
        };
    
        // postcode(); // Assuming this function sets the postcode, not defined in your given code
    
        // Write the response to post.json
        fs.writeFile('post.json', JSON.stringify(response), (err) => {
          if (err) {
            console.error('There was an error writing the file: ', err);
          } else {
            console.log('File has been written');
          }
        });
    
        return res.json(response);
      }
    }
    

   

    if (
      result[0]?.hasOwnProperty("price") ||
      message.includes("charge") ||
      message.includes("delivery")
    ) {
      let prop_weight = parseInt(itemName.weight.trim(), 10);
      let prop_price = itemName.price;
      // const conv_rural_charge = parseInt(rural_charge?.trim(), 10);

      console.log(typeof prop_weight);
      tiggerDetaile(prop_weight, prop_price);

      return;
    }

    function tiggerDetaile(prop_weight, prop_price) {
      console.log("successfully get the weight", prop_weight);
      console.log("successfully get the price", prop_price);
      fs.writeFileSync(
        "weight.json",
        JSON.stringify({ weight: prop_weight, price: prop_price })
      );

      res.json({
        botResponse:
          `\n\n` + "Please tell me your location or area or area code",
      });
      console.log(message);
      if (prop_weight !== undefined) {
      } else {
        console.log(getDeliveryPrice(location, prop_weight)); // Output: 40
      }
    }
    function getDeliveryPrice(location, weight) {
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

    const response = result.reduce((prev, curr) => {
      return prev + ` ${Object.keys(curr)[0]}: ${curr[Object.keys(curr)[0]]} `;
    }, "");

    return res.json({ botResponse: `\n\n` + response });
  }
}

module.exports = {
  getInformation,
};
