import React, { useState } from 'react';
import axios from 'axios';

function Demo() {
  const API_KEY = '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';
  const [text, setText] = useState('');
  const [imageURL, setImageURL] = useState('');

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const generateImage = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/images/generations',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        data: {
          model: 'image-alpha-001',
          prompt: text,
          num_images: 1,
          size: '512x512',
          response_format: 'url',
        },
      });
      setImageURL(response.data.data[0].url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input type="text" value={text} onChange={handleTextChange} />
      <button onClick={generateImage}>Generate Image</button>
      {imageURL && <img src={imageURL} alt="Generated cat on a couch" />}
    </div>
  );
}

export default Demo;
