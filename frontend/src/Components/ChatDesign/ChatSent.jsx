
import React from "react";

const ChatSent = ({ message }) => {
  return (
    <div className="flex justify-end mb-4 animate-fade-ins">
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-lg max-w-md shadow-md break-words">
        <p className="text-md break-words whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
};

export default ChatSent;
