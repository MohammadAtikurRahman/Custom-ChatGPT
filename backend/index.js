require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const fs = require("fs");
const csv = require("csv-parser");

let dataArray = [];

fs.createReadStream("idiya.csv")
  .pipe(csv())
  .on("data", (data) => {
    dataArray.push(data);
  })
  .on("end", () => {
    processData(dataArray);
  });

const processData = (data) => {
  // console.log(data);
};

app.post("/api/", async (req, res) => {
  // const message = req.body.message;

  // const matchingSkuData = dataArray.find(
  //   (d) => message.includes(d.name) && message.includes("sku")
  // );

  // if (matchingSkuData) {
  //   res.json({
  //     botResponse:
  //       "\n\n" + matchingSkuData.name + " of sku: " + matchingSkuData.sku,
  //   });
  //   return;
  // }

  // const matchingPriceData = dataArray.find(
  //   (d) => message.includes(d.name) && message.includes("price")
  // );

  // if (matchingPriceData) {
  //   res.json({
  //     botResponse:
  //       "\n\n" +
  //       matchingPriceData.name +
  //       " of price: " +
  //       matchingPriceData.price,
  //   });
  //   return;
  // }

  // const matchingBrandData = dataArray.find(
  //   (d) => message.includes(d.name) && message.includes("brand")
  // );

  // if (matchingBrandData) {
  //   res.json({
  //     botResponse:
  //       "\n\n" +
  //       matchingBrandData.name +
  //       " of brand: " +
  //       matchingBrandData.brand,
  //   });
  //   return;
  // }

  // const matchingQuantityData = dataArray.find(
  //   (d) => message.includes(d.name) && message.includes("quantity")
  // );

  // if (matchingQuantityData) {
  //   res.json({
  //     botResponse:
  //       "\n\n" +
  //       matchingQuantityData.name +
  //       " of quantity: " +
  //       matchingQuantityData.quantity,
  //   });
  //   return;
  // }

  // const matchingWidthData = dataArray.find(
  //   (d) => message.includes(d.name) && message.includes("width")
  // );

  // if (matchingWidthData) {
  //   res.json({
  //     botResponse:
  //       "\n\n" +
  //       matchingWidthData.name +
  //       " of width: " +
  //       matchingWidthData.width,
  //   });
  //   return;
  // }

  // const matchingHeightData = dataArray.find(
  //   (d) => message.includes(d.name) && message.includes("height")
  // );

  // if (matchingHeightData) {
  //   res.json({
  //     botResponse:
  //       "\n\n" +
  //       matchingHeightData.name +
  //       " of height: " +
  //       matchingHeightData.height,
  //   });
  //   return;
  // }

  // const matchingLengthData = dataArray.find(
  //   (d) => message.includes(d.name) && message.includes("length")
  // );

  // if (matchingLengthData) {
  //   res.json({
  //     botResponse:
  //       "\n\n" +
  //       matchingLengthData.name +
  //       " of length: " +
  //       matchingLengthData.length,
  //   });
  //   return;
  // }

  // const matchingWeightData = dataArray.find(
  //   (d) => message.includes(d.name) && message.includes("Weight")
  // );

  // if (matchingWeightData) {
  //   res.json({
  //     botResponse:
  //       "\n\n" +
  //       matchingWeightData.name +
  //       " of weight: " +
  //       matchingWeightData.Weight,
  //   });
  //   return;
  // }
  // const matchingdescriptionData = dataArray.find(
  //   (d) => message.includes(d.name) && message.includes("description")
  // );

  // if (matchingdescriptionData) {
  //   res.json({
  //     botResponse:
  //       "\n\n" +
  //       matchingdescriptionData.name +
  //       " of description: " +
  //       matchingdescriptionData.description,
  //   });
  //   return;
  // }

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
    const matchingData = dataArray.find(
      (d) => message.includes(d.name) && message.includes(prop.name)
    );
  
    const matchingData1 = dataArray.find(
      (d) => message.includes(d.name) && message.includes("dimension")
    );
  
  
    const matchingData2 = dataArray.find(d => d.name === message);

    const matchingData3 = dataArray.find(d => d.sku === message);


  
    if (matchingData) {
      res.json({
        botResponse: `\n\n${matchingData.name} of ${prop.name}: ${
          matchingData[prop.property]
        }`,
      });
      return;
    } 



    else  if  (matchingData2) {
      res.json({
        botResponse: `\n\n${matchingData2.name} of : ${matchingData2.description}
        }`,
      });
      return;
    } 



    else  if  (matchingData3) {
      res.json({
        botResponse: `\n\n${matchingData3.name} of : ${matchingData3.description}
        }`,
      });
      return;
    } 








    else if (matchingData1) {
      const dimensions = {
        width: matchingData1.width,
        height: matchingData1.height,
        length: matchingData1.length,
      };
  
      // Send the response only once
      res.status(200).json({
        botResponse: `\n\nWidth: ${dimensions.width}, Height: ${dimensions.height}, Length: ${dimensions.length}`,
      });
      return;
    }



  }
  
  // No matching data found
  res.status(404).json({
    botResponse: "No matching data found.",
  });
  

 

  const API_KEY = process.env.OPENAI_API_KEY;

  try {
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
    res.json({ botResponse: "\n" + response.data.choices[0].text });
  } catch (error) {
    res.status(500).send({ error: "Could not generate text completion" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});