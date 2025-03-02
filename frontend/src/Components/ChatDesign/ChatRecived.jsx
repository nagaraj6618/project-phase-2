import React, { useState } from "react";
import TextToSpeech from "../TextToSpeech/TextToSpeech";

const ChatRecived = ({ message, score, suggestion, voiceMessage, id, correctedSentence,index ,activeIndex,setActiveIndex}) => {
  const [showEffects, setShowEffects] = useState(false);

  return (
    <div className="flex justify-start mb-4 animate-fade-ins">
      <div className="bg-gradient-to-r from-gray-500 to-gray-400 text-black p-6 rounded-lg max-w-md shadow-lg border border-gray-300">
        <p className="text-gray-900 text-base font-medium mb-3">
          <span className="font-bold text-blue-800">Score:</span> {score}
        </p>
        <div className="text-gray-900 text-base">
          {suggestion?.length > 0 ? (
            <>
              <span className="font-bold text-green-800">Suggestion:</span>
              <ul className="list-decimal list-inside mt-2 text-gray-900 pl-4 space-y-2 border-l-4 border-green-600 text-sm">
                {suggestion.map((data, index) => (
                  <li key={index} className="text-gray-800 bg-gray-100 p-2 rounded-lg shadow-md border border-gray-300">
                    {data}
                  </li>
                ))}
              </ul>
              <div className="mt-3 p-2 bg-blue-100 border border-blue-500 rounded-lg shadow-md text-sm">
                <span className="font-bold text-blue-800">Corrected Sentence:</span>
                <p className="text-gray-900 mt-1">{correctedSentence}</p>
              </div>
            </>
          ) : (
            <span 
              className="font-bold text-purple-800 text-base bg-purple-200 p-2 rounded-md cursor-pointer relative"
              onMouseEnter={() => setShowEffects(true)}
              onMouseLeave={() => setShowEffects(false)}
            >
              The given sentence is correct!
              {showEffects && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="absolute text-2xl"
                      style={{
                        animation: `pop 1s ease-out forwards`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                    >
                      🎉🎊✨🎆😊
                    </span>
                  ))}
                </div>
              )}
            </span>
          )}
        </div>
        <div className="mt-3">
          <TextToSpeech text={voiceMessage}isPlaying={activeIndex === index} // Check if this button is active
            setPlaying={(isPlaying) => setActiveIndex(isPlaying ? index : null)} // Set active index
            isAnyPlaying={activeIndex !== null}   // Track active button
           />
        </div>
      </div>
      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0.5) translateY(0); opacity: 1; }
            50% { transform: scale(1.5) translateY(-20px); opacity: 0.8; }
            100% { transform: scale(2) translateY(-40px); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default ChatRecived;