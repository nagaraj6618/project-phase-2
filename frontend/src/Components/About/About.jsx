import image1 from "../../assest/images/image-1.jpg";
import anithaImage from "../../assest/images/anitha.png";
import beulah from "../../assest/images/Beulah.jpg";
import Joshua from "../../assest/images/Joshua.jpg";
import harsha from "../../assest/images/harsha.jpg";
import zafreen from "../../assest/images/Zafreen.jpg";
import { IoCloseCircleOutline } from "react-icons/io5";
import React, { useState } from "react";
import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.3 } }),
};

const imagePopupVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
};

const teamMembers = [
  { name: "Nagaraj S", email: "nagaraj516700@gmail.com", image: image1 },
  { name: "Anitha P", email: "anithapalani2004april@gmail.com", image: anithaImage },
  { name: "Harsha", email: "harshavardhini332004@gmail.com", image: harsha },
  { name: "Beulah", email: "joycbeulah7@gmail.com", image: beulah },
  { name: "Zafreen J", email: "zafreen9944@gmail.com", image: zafreen },
  { name: "Joshua Clement D", email: "joshuaclement251106@gmail.com", image: Joshua }
];

const About = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6 overflow-y-auto">
      <motion.div 
        className="bg-gray-800 bg-opacity-60 backdrop-blur-lg p-6 rounded-xl shadow-lg w-full max-w-4xl text-center"
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-2xl font-bold mb-4 text-blue-400" variants={textVariants} custom={0}>
          About Grammar AI
        </motion.h1>
        <motion.p className="text-sm mb-4" variants={textVariants} custom={1}>
          <strong>Grammar AI</strong> is an advanced AI-powered platform that evaluates sentence structure, provides grammar scores, and suggests corrections for grammatical errors. The system ensures high accuracy in grammar correction using a custom-built model.
        </motion.p>
        <motion.h2 className="text-lg font-semibold mb-3 text-blue-300" variants={textVariants} custom={2}>
          Key Features
        </motion.h2>
        <motion.ul className="list-disc list-inside text-left mx-auto max-w-md mb-4 space-y-2 text-sm">
          {["Grammar score and suggestions for sentence improvements", 
            "AI-powered chat history for reference", 
            "Two-Factor Authentication (TFA) for secure login", 
            "Forgot password recovery option", 
            "Account activation status management", 
            "Custom-built grammar prediction model for high accuracy"
          ].map((feature, index) => (
            <motion.li key={index} variants={textVariants} custom={index + 3}>{feature}</motion.li>
          ))}
        </motion.ul>
      </motion.div>
      <button 
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg mt-6 shadow-md transition-transform transform hover:scale-105" 
        onClick={() => setShowPopup(true)}
      >
        Project Developed By
      </button>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-6 overflow-auto z-50" onClick={() => setShowPopup(false)}>
          <motion.div 
            className="p-6 bg-gray-800 rounded-lg shadow-lg max-w-lg text-center relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <IoCloseCircleOutline className="absolute top-2 right-2 text-white text-3xl font-extrabold" onClick={() => setShowPopup(false)} />
            <h2 className="text-xl font-semibold text-blue-400 mb-4">Developed By</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 ">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md text-center">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-24 h-24 object-cover rounded-full mx-auto mb-2 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(member.image);
                    }}
                  />
                  <p className="text-sm font-semibold break-words">{member.name}</p>
                  <p className="text-xs text-gray-400 break-words">{member.email}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
      {/* Full Image View Popup with Animation */}
      {selectedImage && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
          variants={imagePopupVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl p-4 relative">
            <IoCloseCircleOutline className="absolute  right-9 top-6 text-white font-extrabold text-3xl" onClick={() => setSelectedImage(null)}/>
            <img src={selectedImage} alt="Full View" className="w-full h-auto max-h-[60vh] rounded-lg shadow-lg" />
          </div>
        </motion.div>
      )}
    </div>
  );
};
export default About;

