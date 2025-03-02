import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    <div className="flex justify-center items-center">
      <p className="text-red-700 text-base font-semibold animate-fade-ins">
        {message || "An error occurred. Please try again!"}
      </p>
    </div>
  );
};

export default ErrorMessage;
