import React, { useState, useEffect, useRef } from "react";
import { Volume2, Pause } from "lucide-react";

const TextToSpeech = ({ text, isPlaying, setPlaying, isAnyPlaying }) => {
  const [voices, setVoices] = useState([]);
  const speechRef = useRef(null);

  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
    window.speechSynthesis.onvoiceschanged = updateVoices;
    updateVoices();
    window.speechSynthesis.cancel();
  }, []);

  const handlePlayStop = () => {
    if (!text.trim()) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setPlaying(false);
    } else {
      window.speechSynthesis.cancel(); // Stop any existing speech

      const newSpeech = new SpeechSynthesisUtterance(text);
      newSpeech.lang = "en-US";
      const maleVoice = voices.find((v) => v.name.toLowerCase().includes("male")) || voices[0];
      if (maleVoice) {
        newSpeech.voice = maleVoice;
      }

      newSpeech.onend = () => setPlaying(false);

      speechRef.current = newSpeech;
      window.speechSynthesis.speak(newSpeech);
      setPlaying(true);
    }
  };

  return (
    <div>
      <button
        onClick={handlePlayStop}
        disabled={isAnyPlaying && !isPlaying} // Disable all other buttons
        className={`flex mt-1 items-center justify-center w-8 h-8 transition duration-300 hover:scale-110 ${
          isPlaying ? "bg-red-600" : ""
        } ${isAnyPlaying && !isPlaying ? "opacity-50 cursor-not-allowed" : ""} text-white rounded-full`}
      >
        {isPlaying ? <Pause size={18} /> : <Volume2 size={18} className="text-black" />}
      </button>
    </div>
  );
};

export default TextToSpeech;
