import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center space-x-1">
      <span className="dot animate-ping">.</span>
      <span className="dot animate-ping animation-delay-200">.</span>
      <span className="dot animate-ping animation-delay-400">.</span>
    </div>
  );
};

export default Loading;
