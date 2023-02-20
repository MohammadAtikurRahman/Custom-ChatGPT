import React, { useState } from 'react';
import axios from 'axios';
function Demo(props) {
  const [imageURL, setImageURL] = useState('');
  const [isImageGenerated, setIsImageGenerated] = useState(false);

  const generateImage = async (inputPrompt) => {
    if (inputPrompt.startsWith("draw")) {
      try {
        const response = await axios({
          method: "post",
          url: "https://api.openai.com/v1/images/generations",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.API_KEY}`,
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
      {imageURL && <img src={imageURL} alt="Generated cat on a couch" />}
    </div>
  );
}


export default Demo ;
