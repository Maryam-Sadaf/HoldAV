import React from "react";

interface Message {
  message: string;
}

interface MessageAreaProps {
  messages?: Message[];
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages = [] }) => {
  const renderedMessages = messages.map(({ message }) => (
    <li key={Math.random()}>{message}</li>
  ));

  return (
    <div className="message-area">
      <h3>Meldinger:</h3>
      <ul>{renderedMessages}</ul>
    </div>
  );
};

export default MessageArea;
