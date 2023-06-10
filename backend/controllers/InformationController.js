const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");
const { getDeliveryInformation } = require("./DeliveryInformationController");

const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "database.csv",
  header: [
    { id: "message", title: "Message" },
    { id: "price", title: "Price" },
    { id: "shipping", title: "Shipping" },
  ],
});

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


    const areaTocharge = dataArray.find((d) => d.area === message)


    const codeTocharge = dataArray.find((d) => d.code === message)


    if (matchingData2) {
      res.json({
        botResponse: `\n\n${matchingData2.name} of : ${matchingData2.description}`,
      });
      return;
    } 
    
    
    else if (matchingData3) {
      res.json({
        botResponse: `\n\n${matchingData3.name} of : ${matchingData3.description}`,
      });
      return;
    }
    
      
    // else if (areaTocharge) {
    //   res.json({

    //     botResponse: `\n\n${areaTocharge.area} of : ${areaTocharge.charge}`,
    //   });
    //   return;
    // }
    
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



    const weightData = fs.readFileSync("weight.json", 'utf8');
    const parsedWeightData = JSON.parse(weightData);
    const retrievedWeight = parsedWeightData.weight;
    const retrievedPrice = parsedWeightData.price;
        
    
    if (message.includes("Shipping") && retrievedWeight && retrievedPrice || codeTocharge) {


      
      
      const weightData = fs.readFileSync("weight.json", 'utf8');
      const parsedWeightData = JSON.parse(weightData);
      const retrievedWeight = parsedWeightData.weight;
      const priceData = fs.readFileSync("weight.json", 'utf8');
      const parsedPriceData = JSON.parse(priceData);
      const retrievedPrice = parsedPriceData.price;
      const printconvertedint = parseInt(retrievedPrice?.trim(), 10);


      if(codeTocharge?.code){

        var deliveryPrice = getDeliveryPrice(codeTocharge.delivery, retrievedWeight);

      }
      else  {

         deliveryPrice = getDeliveryPrice(message, retrievedWeight);

      }


      const convertedintdelivery = parseInt(deliveryPrice?.trim(), 10);
      const total_price = printconvertedint + convertedintdelivery;
    
      function getDeliveryPrice(location, weight) {
        const deliveryRule = deliveryDataArray.find(rule => {
          return (
            rule.location === location &&
            ((rule.operator === '<' && weight < rule['weight-dl']) ||
              (rule.operator === '=' && weight == rule['weight-dl']))
          );
        });
    
        if (deliveryRule) {
          return deliveryRule.deliveryPrice;
        } else {
          return `No delivery price found for location ${location} and weight ${weight}`;
        }
      }
    
      if(codeTocharge?.charge == '39'){

        const rural_charge = codeTocharge.charge;
        const conv_rural_charge = parseInt(rural_charge?.trim(), 10);

      const response = {
        botResponse: `\n\nPrice ${retrievedPrice} For Weight ${retrievedWeight} Deliver Charge ${deliveryPrice} for rural area extra charge added ${codeTocharge.charge}  Total Price ${total_price+conv_rural_charge}`,
      };
    
      // Write an empty JSON object to weight.json
      fs.writeFileSync('weight.json', JSON.stringify({}));
    
      return res.json(response);
      
    }
    if(codeTocharge?.charge == '0'){

      const rural_charge = codeTocharge.charge;
      const conv_rural_charge = parseInt(rural_charge?.trim(), 10);

    const response = {
      botResponse: `\n\nPrice ${retrievedPrice} For Weight ${retrievedWeight} Deliver Charge ${deliveryPrice}  Total Price ${total_price}`,
    };
  
    // Write an empty JSON object to weight.json
    fs.writeFileSync('weight.json', JSON.stringify({}));
  
    return res.json(response);
    
  }



    // if(codeTocharge?.charge == "undifined")
    else
    {

      const response = {
        botResponse: `\n\nPrice ${retrievedPrice} For Weight ${retrievedWeight} Deliver Charge ${deliveryPrice} Total Price ${total_price}`,
      };
    
      // Write an empty JSON object to weight.json
      fs.writeFileSync('weight.json', JSON.stringify({}));
    
      return res.json(response);
      
    }


    }
     

        
    if (message.includes("Shipping") && retrievedWeight && retrievedPrice || areaTocharge) {


      
      
      const weightData = fs.readFileSync("weight.json", 'utf8');
      const parsedWeightData = JSON.parse(weightData);
      const retrievedWeight = parsedWeightData.weight;
      const priceData = fs.readFileSync("weight.json", 'utf8');
      const parsedPriceData = JSON.parse(priceData);
      const retrievedPrice = parsedPriceData.price;
      const printconvertedint = parseInt(retrievedPrice?.trim(), 10);


      if(areaTocharge?.area){

        var deliveryPrice = getDeliveryPrice(areaTocharge.delivery, retrievedWeight);

      }
      else  {

         deliveryPrice = getDeliveryPrice(message, retrievedWeight);

      }


      const convertedintdelivery = parseInt(deliveryPrice?.trim(), 10);
      const total_price = printconvertedint + convertedintdelivery;
    
      function getDeliveryPrice(location, weight) {
        const deliveryRule = deliveryDataArray.find(rule => {
          return (
            rule.location === location &&
            ((rule.operator === '<' && weight < rule['weight-dl']) ||
              (rule.operator === '=' && weight == rule['weight-dl']))
          );
        });
    
        if (deliveryRule) {
          return deliveryRule.deliveryPrice;
        } else {
          return `No delivery price found for location ${location} and weight ${weight}`;
        }
      }
    
      if(areaTocharge?.charge){

        const rural_charge = areaTocharge.charge;
        const conv_rural_charge = parseInt(rural_charge?.trim(), 10);

      const response = {
        botResponse: `\n\nPrice ${retrievedPrice} For Weight ${retrievedWeight} Deliver Charge ${deliveryPrice} for rural area extra charge added ${areaTocharge.charge}  Total Price ${total_price+conv_rural_charge}`,
      };
    
      // Write an empty JSON object to weight.json
      fs.writeFileSync('weight.json', JSON.stringify({}));
    
      return res.json(response);
      
    }






    // if(codeTocharge?.charge == "undifined")
    else
    {

      const response = {
        botResponse: `\n\nPrice ${retrievedPrice} For Weight ${retrievedWeight} Deliver Charge ${deliveryPrice} Total Price ${total_price}`,
      };
    
      // Write an empty JSON object to weight.json
      fs.writeFileSync('weight.json', JSON.stringify({}));
    
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
    if  (result.length === 0) {

      
      return res.status(400).json({ error: "No matching data found" });
    }

    if (result[0]?.hasOwnProperty("price")) {
      let prop_weight = itemName.weight;
      let prop_price = itemName.price;
     
      tiggerDetaile(prop_weight, prop_price);

      return;
    }



    function tiggerDetaile(prop_weight, prop_price) {
      console.log("successfully get the weight", prop_weight);
      console.log("successfully get the price", prop_price);
      fs.writeFileSync("weight.json", JSON.stringify({weight: prop_weight, price: prop_price}));

      res.json({ botResponse: `\n\n` + "Please tell me your location or area or area code" });
      console.log(message);
      if(prop_weight != "undifined"){

      }
      else{
        console.log(getDeliveryPrice(location, prop_weight)); // Output: 40


      }
    }
    function getDeliveryPrice(location, weight) {
      // Find the delivery rule that matches the location and weight
      const deliveryRule = deliveryDataArray.find(rule => {
        return rule.location === location && (
          (rule.operator === '<' && weight < rule['weight-dl']) ||
          (rule.operator === '=' && weight == rule['weight-dl'])
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
