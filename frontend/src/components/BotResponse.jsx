import React, { useEffect, useRef, useState } from "react";

const BotResponse = ({ response }) => {
  const [botResponse, setBotResponse] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    setBotResponse(response);
  }, [response]);
  

  
  const scrollToBottom = () => {
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [botResponse]);

  return (
    <pre ref={containerRef}>
      {botResponse}
      {botResponse === response ? "" : "|"}
    </pre>
  );
};

export default BotResponse;
