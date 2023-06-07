import React, { useState } from 'react';

function YourComponent() {
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = (message) => {
    setMessage(message);
    setShowMessage(true);
  };

  return (
    <div id="introsection">
      {/* <p>
        Features:
        <ul>
          <li><button onClick={() => handleClick('Message 1')}>Product name + price, sku, brand, weight, height, dimension</button></li>
          <li><button onClick={() => handleClick('Message 2')}>Product name + price + shipping name</button></li>
          <li><button onClick={() => handleClick('Message 3')}>Product name + shipping name</button></li>
          <li><button onClick={() => handleClick('Message 4')}>recom + Product name = Recommended Product (max 10)</button></li>
          <li><button onClick={() => handleClick('Message 5')}>sku, Product name = description</button></li>
        </ul>
      </p>
      {showMessage && <div style={{ position: "fixed" , bottom: "6.3%",left: "25%", zIndex: "9999"}} id="messageBox">{message}</div>} */}
    </div>
  );
}

export default YourComponent;
