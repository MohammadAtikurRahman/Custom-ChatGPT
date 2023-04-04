const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");
const { getDeliveryInformation } = require("./DeliveryInformationController");
const stringSimilarity = require("string-similarity");
const levenshtein = require("fast-levenshtein");

var sender;
let expirationTimestamp = Date.now() + 60000; // Expiration time set to 1 minute from now

let messageReceiver = "";


var storeData = {}

var userData = {};

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

let areaCodeArray = [];

fs.createReadStream("areaCode.csv")
  .pipe(csv())
  .on("data", (data) => {
    areaCodeArray.push(data);
  })
  .on("end", () => {
    // console.log("Delivery CSV file processed.");
    processData(areaCodeArray);
    // console.log(deliveryDataArray); // Print the deliveryDataArray here
  });

let recomArray = [];
fs.createReadStream("recom.csv")
  .pipe(csv())
  .on("data", (data) => {
    recomArray.push(data);
  })
  .on("end", () => {
    // console.log("Delivery CSV file processed.");
    processData(recomArray);
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
    var search_result = matchedItemsdata[0];

    console.log("search result", search_result?.name);

    const dimensionRegex = /d[iae]*m[ea]*n[st]*s*[io]*[nm]*[ae]*n*/gi;

    const matchingData1 = search_result && dimensionRegex.test(message);

    console.log("dimension check", matchingData1);

    // const matchingData2 = dataArray.find((d) => d.name === search_result);

    var queriesdata = properties.filter((p) => message.includes(p.name));

    console.log("query data", queriesdata);

    // console.log("matching data2",matchingData2)

    const matchingData3 = dataArray.find((d) => d.sku === message);

    // const recomData = recomArray.find((d) => message.startsWith("recom") && d.name.includes(message.substring(5).trim()));
    // if (recomData) {
    //   return res.json({
    //     botResponse: "\n\n" + "Recommended product: " + recomData.name + " (ref: " + recomData.ref + ")"
    //   });
    // }
    // console.log("recomandation data",recomData);

    // if (message.startsWith("recom")) {
    //   const item = message.substring(6); // Remove the first 6 characters ("recom" and a space)
    //   // console.log(item);

    //   const finder = `You're an expert from New Zealand in Furniture business for 20 years. You are tasked to find out the most popular, relevant and high demand product recommendation that goes with certain product. Target market is New Zealand. You will be fed with the product list and you will provide 20 recommended products against each product. If you have any question about this prompt, ask before you try to generate recommended products. product is ${item}`;
    //   // console.log(finder);

    //   if (item) {
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
    //           prompt: finder,
    //           max_tokens: 4000,
    //           n: 1,
    //           stop: "",
    //           temperature: 1,
    //         },
    //       });

    //       const botResponse = "\n\n" + response.data.choices[0].text.trim();

    //       // // Save the bot response and recom name to a CSV file
    //       // const csvData = `"${item}","${botResponse.replace(/"/g, '""')}"\n`;
    //       // fs.appendFile('recom_responses.csv', csvData, (err) => {
    //       //   if (err) {
    //       //     console.error('Error writing to file:', err);
    //       //   } else {
    //       //     console.log('Data saved to file');
    //       //   }
    //       // });

    //       return res.json({ botResponse });

    //     } catch (error) {
    //       return res
    //         .status(500)
    //         .send({ error: "Could not generate text completion" });
    //     }
    //   }
    // } else {
    // }

    // if (message.startsWith("gpt")) {
    //   const searchTerm = message.substring(5).trim();
    //   const minSimilarityThreshold = 0.4;

    //   // Define a function to calculate the similarity score
    //   function similarityScore(productName, searchTerm) {
    //     return (
    //       1 -
    //       levenshtein.get(productName, searchTerm) /
    //         Math.max(productName.length, searchTerm.length)
    //     );
    //   }

    //   const similarProducts = recomArray
    //     .map((product) => ({
    //       ...product,
    //       similarity: similarityScore(product.name, searchTerm),
    //     }))
    //     .filter((product) => product.similarity >= minSimilarityThreshold)
    //     .sort((a, b) => b.similarity - a.similarity)
    //     .slice(0, 10);
    //   if (similarProducts.length > 0) {
    //     let botResponse = "\n\n" + "Recommended Products:\n";

    //     for (const product of similarProducts) {
    //       botResponse += "- " + product.name + " (ref: " + product.ref + ")\n";
    //     }

    //     return res.json({
    //       botResponse: botResponse,
    //     });
    //   } else {
    //     // Handle case when no similar products are found
    //     return res.json({
    //       botResponse: "\n\nThere are no similar products.",
    //     });
    //   }
    // } else {
    //   // Handle other types of messages
    // }

    //  if(message.startsWith("save")) {
    //     const item = message.substring(6); // Remove the first 6 characters ("recom" and a space)
    //     // console.log(item);

    //     const finder = `You're an expert from New Zealand in Furniture business for 20 years. You are tasked to find out the most popular, relevant and high demand product recommendation that goes with certain product. Target market is New Zealand. You will be fed with the product list and you will provide 20 recommended products against each product. If you have any question about this prompt, ask before you try to generate recommended products. product is ${item}`;
    //     // console.log(finder);

    //     if (item) {
    //       try {
    //         const API_KEY = process.env.OPENAI_API_KEY;
    //         const response = await axios({
    //           method: "post",
    //           url: "https://api.openai.com/v1/engines/text-davinci-003/completions",
    //           headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${API_KEY}`,
    //           },
    //           data: {
    //             prompt: finder,
    //             max_tokens: 3000,
    //             n: 1,
    //             stop: "",
    //             temperature: 1,
    //           },
    //         });

    //         const botResponse = "\n\n" + response.data.choices[0].text.trim();;
    //         return res.json({ botResponse });

    //       } catch (error) {
    //         return res
    //           .status(500)
    //           .send({ error: "Could not generate text completion" });
    //       }
    //     }
    //   } else {
    //     // Handle other types of messages
    //   }

    if (message.startsWith("data")) {
      const BATCH_SIZE = 50; // Change the batch size according to your preference
      const WAIT_TIME = 60000; // Time to wait between batches, in milliseconds

      async function saveRecommendations(recomArray) {
        let i = 0;

        while (i < recomArray.length) {
          const batch = recomArray.slice(i, i + BATCH_SIZE);

          const promises = batch.map(async (item) => {
            const productName = `${item.name}, ${item.ref}`;
            const finder = `You're an expert from New Zealand in Furniture business for 20 years. You are tasked to find out the most popular, relevant and high demand product recommendation that goes with certain product. Target market is New Zealand. You will be fed with the product list and you will provide 20 recommended products against each product. If you have any question about this prompt, ask before you try to generate recommended products. product is ${productName}`;

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
                  prompt: finder,
                  max_tokens: 3000,
                  n: 1,
                  stop: "",
                  temperature: 1,
                },
              });

              const botResponse = response.data.choices[0].text.trim();

              // Save the bot response and recom name to a CSV file
              const csvData = `"${productName}","${botResponse.replace(
                /"/g,
                '""'
              )}"\n`;
              fs.appendFile("responses_data.csv", csvData, (err) => {
                if (err) {
                  console.error("Error writing to file:", err);
                } else {
                  console.log(`Data saved for: ${productName}`);
                }
              });
            } catch (error) {
              console.error("Error generating text completion:", error);
            }
          });

          await Promise.all(promises);
          console.log(`Batch ${i + 1} to ${i + BATCH_SIZE} completed.`);
          i += BATCH_SIZE;

          if (i < recomArray.length) {
            console.log(
              `Waiting for ${
                WAIT_TIME / 1000
              } seconds before starting the next batch...`
            );
            await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
          }
        }
      }

      saveRecommendations(recomArray);
    }

    const matchesdataLocation = stringSimilarity.findBestMatch(
      message,
      deliveryDataArray.map((d) => d.location)
    );
    let matchedItemsdataLocation = [];
    if (matchesdataLocation.bestMatch.rating > 0.3) {
      const matchedItemdataLocation =
        deliveryDataArray[matchesdataLocation.bestMatchIndex];
      matchedItemsdataLocation.push(matchedItemdataLocation);
    } else {
      console.log("No match found");
    }
    // console.log("matched item:", matchedItems[0]);
    var matchingData2 = matchedItemsdataLocation[0];

    const areaMatch = stringSimilarity.findBestMatch(
      message,
      areaCodeArray.map((d) => d.area)
    );

    const deliveryMatch = stringSimilarity.findBestMatch(
      message,
      areaCodeArray.map((d) => d.delivery)
    );

    const codeMatch = stringSimilarity.findBestMatch(
      message,
      areaCodeArray.map((d) => d.code)
    );

    const foundItems = [];
    let matchedDelivery = null;
    let extraPrice = null;
    let extraPrice1 = null;

    if (areaMatch.bestMatch.rating > 0.3) {
      const foundItem = areaCodeArray[areaMatch.bestMatchIndex];
      foundItems.push(foundItem);
      console.log("Area:", foundItem.area, "Delivery:", foundItem.delivery);
      matchedDelivery = foundItem.delivery;
      extraPrice1 = foundItem.charge;
      var globalPrice1 = Number(extraPrice1);
      var area = foundItem.area;
      storeData.area =area;


    }

    if (deliveryMatch.bestMatch.rating > 0.3) {
      const foundItem = areaCodeArray[deliveryMatch.bestMatchIndex];
      foundItems.push(foundItem);
      console.log("Delivery:", foundItem.delivery);
      matchedDelivery = foundItem.delivery;
    }

    if (codeMatch.bestMatch.rating > 0.3) {
      const foundItem = areaCodeArray[codeMatch.bestMatchIndex];
      foundItems.push(foundItem);
      console.log("Code:", foundItem.code, "Delivery:", foundItem.delivery);
      matchedDelivery = foundItem.delivery;
      extraPrice = foundItem.charge;

      var codeArea = foundItem.code;

      var globalPrice = Number(extraPrice);

        storeData.codeArea =codeArea;




    }
    setTimeout(() => {
      delete storeData.codeArea;
      delete storeData.area 
      console.log("Data deleted after 20 seconds");
    }, 20000);




    if (foundItems.length === 0) {
      console.log("No matching data found");
    } else {
      console.log("Matched Delivery:", matchedDelivery);
    }

    console.log("1 global", globalPrice1);

    console.log("delivbery", matchedDelivery);
    console.log("extra price", extraPrice);

    console.log("globalPrice ", globalPrice);

    if (globalPrice1) {
      globalPrice = globalPrice1;
    }

    if (matchedDelivery) {
      var location = matchedDelivery;

      console.log("location accepted", location);
      const matchesdataLocation = stringSimilarity.findBestMatch(
        location,
        deliveryDataArray.map((d) => d.location)
      );
      let matchedItemsdataLocation = [];
      if (matchesdataLocation.bestMatch.rating > 0.3) {
        const matchedItemdataLocation =
          deliveryDataArray[matchesdataLocation.bestMatchIndex];
        matchedItemsdataLocation.push(matchedItemdataLocation);
      } else {
        console.log("No match found");
      }
      // console.log("matched item:", matchedItems[0]);
      var matchingLocation = matchedItemsdataLocation[0];
      // console.log("matching location",matchingLocation)

      // console.log("xyzxxxxxxxx",matchingLocation)
      // matchingData2 = matchingLocation
    }

    console.log("xyzxxxxxxxx", matchingLocation);
    matchingData2 = matchingLocation;

    console.log("similar", matchingData2?.location);
    console.log("abcd", matchingData2);

    if (matchingData2?.location) {
      console.log("for this iffff");

      const bayOfPlentyData = deliveryDataArray.filter(
        (d) => d.location === matchingData2.location
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

      console.log(
        "weight & location & price",
        search_result?.weight,
        matchingData2.location,
        search_result?.price
      );

      const location = matchingData2.location;
      const weight = Number(search_result?.weight);

      console.log("weight", weight);

      console.log("it will be location or area code", location);

      const delivery_charge = getDeliveryPrice(location, weight); // Output: 40

      const num_delivery_charge = Number(delivery_charge);

      const num_price = Number(search_result?.price);
      const total_price = num_price + num_delivery_charge;

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

      if (weight !== 0 && search_result) {
        return res.json({
          botResponse:
            "\n\n" +
            "Shipping Charge depends on Product Weight and whether it is Heavy or Fragile. For " +
            matchingData2.location +
            "  the lowest shipping charge is " +
            deliveryPrices.minPrice +
            " and the Highest Shipping charge is " +
            deliveryPrices.maxPrice +
            " based on your product weight delivery charge is " +
            delivery_charge +
            "." +
            " total price is " +
            total_price,
        });
      } else {
        console.log("price sending shipping inside", userData?.prop_price);
        console.log("weight sending shipping inside", userData?.prop_weight);

        const price_sh = Number(userData?.prop_price);
        const weight = Number(userData?.prop_weight);
        const location = matchingData2.location;

        const deliveryChargesh = getDeliveryPrice(location, weight);
        console.log("inside the shipping of the alll data", deliveryChargesh);

        const final_money = price_sh + Number(deliveryChargesh);
        console.log("final price of the event", final_money);

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
            return;
          }
        }

        if (
          !isNaN(final_money) &&
          (globalPrice == 0 || globalPrice == undefined) &&
          globalPrice == undefined
        ) {
          return res.json({
            botResponse:
              "\n\n" +
              "Shipping Charge depends on Product Weight and whether it is Heavy or Fragile. For " +
              matchingData2.location +
              "  the lowest shipping charge is " +
              deliveryPrices.minPrice +
              " and the Highest Shipping charge is " +
              deliveryPrices.maxPrice +
              "." +
              " based on weight the delivery charge is " +
              deliveryChargesh +
              " and final price is entering " +
              final_money,
          });
        }
        var helperText = "Could you please tell me the name of your product?";
        var helperLocation;
        var helperPrice;
        var helperPrice1;

        if (globalPrice > 0 && !isNaN(final_money)) {
          return res.json({
            botResponse:
              "\n\n" +
              "Shipping Charge depends on Product Weight and whether it is Heavy or Fragile. For " +
              matchingData2.location +
              "  the lowest shipping charge is " +
              deliveryPrices.minPrice +
              " and the Highest Shipping charge is " +
              deliveryPrices.maxPrice +
              "." +
              " based on weight the delivery charge is " +
              deliveryChargesh +
              " for rural area extra charge added " +
              globalPrice +
              " and final price is " +
              (globalPrice + final_money),
          });
        } else {
          userInfo.helperText = helperText;
          userInfo.helperLocation = matchingData2.location;
          userInfo.globalPrice = globalPrice;
          userInfo.globalPrice1 = globalPrice1;

          console.log("global pric which we will use 0",  userInfo.globalPrice);
          console.log(
            "global pric which we will use 1",
            userInfo.globalPrice1
          );

          return res.json({
            botResponse:
              "\n\n" +
              "Shipping Charge depends on Product Weight and whether it is Heavy or Fragile. For " +
              matchingData2.location +
              "  the lowest shipping charge is " +
              deliveryPrices.minPrice +
              " and the Highest Shipping charge is " +
              deliveryPrices.maxPrice +
              " " +
              helperText +
              "",
          });
        }
      }
    }

    console.log("back propagation ", userInfo.helperText);
    console.log("back location", userInfo.helperLocation);

    if (
      queriesdata.length === 0 &&
      matchingData1 === false &&
      userInfo.helperText == undefined
    ) {
      res.json({
        botResponse: `\n\n${search_result.name}: ${search_result.description}
          }`,
      });
      return;
    }
    let requestCounter = 0;

    // Assuming this is your request handling function
    function handleRequest() {
      requestCounter++; // Increment the request counter for each incoming request
    
      // Process your request here...
    
      if (requestCounter === 2) { // Check if it's the 2nd request
        delete userInfo.helperText;
        console.log("Data deleted after 2nd request");
      }
    }
    
    // Simulate incoming requests
    handleRequest(); // 1st request
    handleRequest(); // 2nd request
    
    if (userInfo.helperText) {
     
      

     
     
      userInfo.globalPrice = globalPrice;
      userInfo.globalPrice1 = globalPrice1;

      console.log("TRUE location", userInfo.helperLocation);
      console.log("godzila", search_result);

      const inside_price = getDeliveryPrice(
        userInfo.helperLocation,
        search_result.weight
      );
      console.log("inside price", inside_price);

      const inside_main_price = Number(search_result.price);
      const inside_delivery_price = Number(inside_price);
      const main_price = inside_main_price + inside_delivery_price;

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

      const bayOfPlentyData = deliveryDataArray.filter(
        (d) => d.location === userInfo.helperLocation
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



      console.log("helper text",userInfo.helperText)
      console.log("price1",userInfo.globalPrice1)
      console.log("price",userInfo.globalPrice)



      console.log("another testing", storeData.codeArea  )
      console.log("area testing",      storeData.area  )

      const area =storeData.area ;
      const code =storeData.codeArea ;

          const matchingData3 = areaCodeArray.find((d) => d.area === area);
          if(matchingData3){
            console.log("value of Area based",matchingData3?.charge)
            var chargeof1 = matchingData3?.charge;
          }

            const matchingData2 = areaCodeArray.find((d) => d.code === code);
            if(matchingData2){
            console.log("value of Code based",matchingData2?.charge)
            var chargeof2= matchingData2?.charge;
            }





      if (
        chargeof1 == undefined &&
        chargeof2 == undefined  && queriesdata.length === 0
      ) {
        return res.json({
          botResponse:
            "\n\n" +
            "Shipping Charge depends on Product Weight and whether it is Heavy or Fragile. For " +
            userInfo.helperLocation +
            "  the lowest shipping charge is " +
            deliveryPrices.minPrice +
            " and the Highest Shipping charge is " +
            deliveryPrices.maxPrice +
            "." +
            " based on weight the delivery charge is " +
            inside_price +
            
            " and final price is  " +(main_price)+"",
        });
      }

      if (chargeof1 == 0 || chargeof2 ==0 && queriesdata.length === 0) {
        return res.json({
          botResponse:
            "\n\n" +
            "Shipping Charge depends on Product Weight and whether it is Heavy or Fragile. For " +
            userInfo.helperLocation +
            "  the lowest shipping charge is " +
            deliveryPrices.minPrice +
            " and the Highest Shipping charge is " +
            deliveryPrices.maxPrice +
            "." +
            " based on weight the delivery charge is " +
            inside_price +
            "" + " and final price is " +
            +(main_price),
        });
      }

     if(queriesdata.length === 0) {
        return res.json({
          botResponse:
            "\n\n" +
            "Shipping Charge depends on Product Weight and whether it is Heavy or Fragile. For " +
            userInfo.helperLocation +
            "  the lowest shipping charge is " +
            deliveryPrices.minPrice +
            " and the Highest Shipping charge is " +
            deliveryPrices.maxPrice +
            "." + "basic price is "  + search_result.price+
            " based on weight the delivery charge is " +
            inside_price +
            " for rural area extra charge added " +
            (chargeof1 ? chargeof1 + " " : "") +
            ""+  (chargeof2 ? chargeof2 + " " : "") +

            " and final price is " + ( Number((chargeof1 ? chargeof1 + " " : ""))+Number((chargeof2 ? chargeof2 + " " : ""))+main_price)  ,
        });
      }
    } else if (matchingData3) {
      res.json({
        botResponse: `\n\n${matchingData3.name}: ${matchingData3.description}
          }`,
      });
      return;
    }

    if (matchingData1) {
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

    console.log(
      "%cFuzzy Search is happening " + itemName?.name,
      "color: yellow"
    );

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
    console.log("queries", queries);

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

    // console.log("result zero", result[0]);

    if (result[0].hasOwnProperty("price")) {
      const prop_weight = itemName.weight;
      const prop_price = itemName.price;
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
            console.log("message Receiver", messageReceiver);
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
                "\n\n" +
                itemName.name +
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
            userData.prop_price = prop_price;
            userData.prop_weight = prop_weight;

            res.json({
              botResponse:
                "\n\n" +
                itemName.name +
                " Shipping Charge depends on Product Weight and location and whether it is Heavy or Fragile." +
                "Basic price " +
                prop_price +
                " here weight charged will be added based on location. What is your location or area code?",
            });

            console.log("price sending", prop_price);
            console.log("weight sending", prop_weight);

            setTimeout(() => {
              delete userData.prop_price;
              delete userData.prop_weight;
              console.log("Data deleted after 1 minute");
            }, 90000);
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
