import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { MdOutlineMicNone } from "react-icons/md";
import { PiWaveform } from "react-icons/pi";
import { IoMdSend } from "react-icons/io";
import ErrorMessage from './ErrorMessage';
import Loading from '../Loading/Loading';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import ChatSent from './ChatSent';
import ReadmeViewer from '../ReadmeViewer/ReadmeViewer';

const AIChatHome = () => {
   const { id } = useParams();
   const [isRecording, setIsRecording] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [isError, setIsError] = useState(false);
   const [message, setMessage] = useState("");
   const [data, setData] = useState([
   ]);
   const recognitionRef = useRef(null);
   // Initialize Speech Recognition once

   useEffect(() => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
         const recognition = new SpeechRecognition();
         recognition.continuous = false;
         recognition.interimResults = false;
         recognition.lang = "en-US";

         // Handle recognition results
         recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setMessage(transcript);
            setIsRecording(false);
         };

         // Handle recognition errors
         recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsRecording(false);
         };

         // Handle manual stop to prevent auto-restart
         recognition.onend = () => {
            if (!isRecording) {
               console.log("Voice recognition stopped manually.");
            }
         };

         recognitionRef.current = recognition;
      } else {
         console.warn("Speech Recognition not supported in this browser.");
      }
   }, []);

   // Toggle voice recording
   const toggleRecording = () => {
      if (!recognitionRef.current) return;

      if (isRecording) {
         stopVoiceRecognition();
      } else {
         startVoiceRecognition();
      }
   };

   // Start voice recognition
   const startVoiceRecognition = () => {
      if (recognitionRef.current) {
         setIsRecording(true);
         recognitionRef.current.start();
         console.log("Voice recognition started...");
      }
   };

   // Stop voice recognition
   const stopVoiceRecognition = () => {
      if (recognitionRef.current) {
         setIsRecording(false);
         recognitionRef.current.stop();
         console.log("Voice recognition stopped.");
      }
   };
   const handleSend = async (e) => {
      e.preventDefault();

      if (message.trim()) {
         console.log("Message : ", message);
      }
      const data_id = data.length;
      try{
          if (message.trim()) {
              setData((prevData) => [
                  ...prevData,
                  { request: message,response:{},id:data_id}
              ]);
              console.log("Message sent:", message);
              setMessage("");
              setIsLoading(true);
              setIsError(false);
          const token = localStorage.getItem("token") || ""
          const response = await axios.post(`${prod_be_url}/ai?type=${id}`,
              {
                  text:message,
                  type:id,
              },{
              headers:{
                  Authorization: `Bearer ${token}`
              }
          })
          console.log(response.data)
          setData((prevData) => 
              prevData.map((item) => 
              item.id === data_id ? { ...item, response: response.data.data.response ,request:response.data.data.request,_id:response.data.data._id} : item
              )
          );
          console.log(response.data)
          setIsLoading(false)
         //  navigate(`/chat/${response?.data?.data?.chatHistoryId}`);
         //  chatHistoryApi();
         // getChatDataBsedOnHistory()
          }
      }
      catch(err){
          setIsLoading(false);
          setIsError(true);
      }
   }
   // Auto-scroll to bottom on new message
   useEffect(() => {
      const chatContainer = document.querySelector('.chat-content');
      if (chatContainer) {
         chatContainer.scrollTop = chatContainer.scrollHeight;
      }
   }, [data]);
   useEffect(() => {
      getChatDataBsedOnHistory();
   }, [id])

   const getChatDataBsedOnHistory = async () => {
      try {
         const token = localStorage.getItem("token") || "";
         const response = await axios.get(`${prod_be_url}/ai?type=${id}`, {
            headers: {
               Authorization: `Bearer ${token}`
            }
         });
         let chatDatas = response.data.data;
         chatDatas = chatDatas.map((data, index) => ({
            ...data,
            id: index
         }));
         console.log(chatDatas);
         setData(chatDatas)
      } catch (error) {
         console.log("error", error.message);
      }
   }

   return (
      <div className="flex flex-col h-full bg-gray-900 text-white ">
         {/* Chat content */}
         <div className={`max-w-xl max-h-[90vh] chat-content flex-grow overflow-y-auto p-4 transition-all duration-500 ${id === "new" ? "flex flex-col items-center justify-center text-center" : ""}`}>
            {data.length <=0 ? (
               <div className="welcome-message text-xl font-semibold text-gray-300 animate-fadeIn text-center">
                  <p className="text-green-400 text-2xl mb-3 animate-bounce">👋 Hi, I am here to help you with grammar!</p>
                  <p className="text-gray-400 animate-fadeInSlow">Start by typing a sentence or speaking into the mic.</p>
               </div>
            ) : (
                 data.map((chat, index) => (
                     <div key={index} className="message-container  mb-2 opacity-100 animate-fadeIn">
                         <ChatSent message={chat.request} />
                         <ReadmeViewer content={chat.response.content} className="h-[90vh] w-10"/>
                     </div>
                 ))
               // <div></div>
            )}
            {isLoading && <div className="flex justify-start mb-4"><Loading /></div>}
            {isError && <div><ErrorMessage /></div>}
         </div>

         {/* Input and Send button */}
         <form
            onSubmit={handleSend}
            className={`p-2 flex flex-col mt-auto mb-3 ${id === "new" ? "w-full" : ""}`}>
            <div className="flex items-center  p-2 mt-auto mb-1">
               <input
                  type="text"
                  className="w-4/5 p-2 border border-gray-600 rounded-full text-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setIsError(false); }}
               />
               <button
                  type="submit"
                  className="ml-5 p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300 ease-in-out"
               >
                  <IoMdSend />
               </button>
               <button
                  onClick={toggleRecording}
                  className={`ml-3 p-2 rounded-full ${isRecording ? "bg-red-500" : "bg-gray-200 text-black"} hover:bg-opacity-80 transition-all duration-300 ease-in-out`}
               >
                  {isRecording ? <PiWaveform /> : <MdOutlineMicNone />}
               </button>
            </div>
         </form>
      </div>

      // <div className="flex flex-col h-full bg-gray-900 text-white">
      //    <div className="chat-content flex-grow p-4 overflow-y-auto max-h-[90vh] w-full  mx-auto border border-gray-700 rounded-lg">
      //       {data.length === 0 ? (
      //          <div className="text-center text-gray-400">Start by typing a message or using the mic.</div>
      //       ) : (
      //          data.map((chat, index) => (
      //             <div key={index} className="mb-2">
      //                <ChatSent message={chat.request} />
      //                <ReadmeViewer content={chat.response.content} />
      //             </div>
      //          ))
      //       )}
      //       {isLoading && <Loading />}
      //       {isError && <ErrorMessage />}
      //    </div>

      // //    <form onSubmit={handleSend} className="p-2 flex flex-col w-full max-w-2xl mx-auto">
      // //       <div className="flex items-center p-2">
      // //          <input
      //             type="text"
      //             className="w-full p-2 border border-gray-600 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
      //             placeholder="Type your message..."
      //             value={message}
      //             onChange={(e) => { setMessage(e.target.value); setIsError(false); }}
      //          />
      //          <button type="submit" className="ml-2 p-2 bg-green-500 text-white rounded-full hover:bg-green-600">
      //             <IoMdSend />
      //          </button>
      //          <button onClick={toggleRecording} className={`ml-2 p-2 rounded-full ${isRecording ? "bg-red-500" : "bg-gray-200 text-black"}`}>
      //             {isRecording ? <PiWaveform /> : <MdOutlineMicNone />}
      //          </button>
      //       </div>
      //    </form>
      // </div>
      
   )
}

export default AIChatHome