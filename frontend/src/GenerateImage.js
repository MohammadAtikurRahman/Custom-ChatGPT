import React, { useState } from 'react';
import axios from 'axios';

function GenerateImage() {
  const [inputPrompt, setInputPrompt] = useState("");
  const API_KEY = process.env.REACT_APP_IMAGES_KEY;
  const [imageURL, setImageURL] = useState("");
  const [setIsImageGenerated] = useState(false);

  const generateImage = async () => {
    if (inputPrompt.startsWith("draw")) {
      try {
        const response = await axios({
          method: "post",
          url: "https://api.openai.com/v1/images/generations",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          data: {
            model: "image-alpha-001",
            prompt: inputPrompt,
            num_images: 1,
            size: "512x512",
            response_format: "url",
          },
        });
        setImageURL(response.data.data[0].url);
        setIsImageGenerated(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <input type="text" value={inputPrompt} onChange={(e) => setInputPrompt(e.target.value)} />
      <button onClick={generateImage}>Generate Image</button>
      {imageURL && <image src={imageURL} alt="Generated Image" />}
    </div>
  );
}
export default GenerateImage;
