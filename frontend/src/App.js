import './App.css';
import TextToSpeech from './Components/TextToSpeech/TextToSpeech';
import { showErrorToast, showInfoToast, ToastNotifications } from './Components/ToastMessage/ToastMessageComponent';
import useIdleTimer from './hook/useIdleTimer';
import {useEffect} from "react"
import AppLayout from './Layout/AppLayout';
import { useAuth } from './Context/AuthContext';
import axios from 'axios';
import { prod_be_url } from './utils/config';
function App() {
  const {isAuthenticated,logout,setChatHistory,setIsChatLoading} = useAuth();
  // const { startTimer, stopTimer } = useIdleTimer(handleLogout, 1800000);
  const { startTimers, stopTimers } = useIdleTimer(handleLogout, 1800000, 82800000); 
  function handleLogout ()  {
      logout();
      localStorage.removeItem("sessionStartTime");
      showInfoToast("Session expired");
  };
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     startTimer();
  //   } else {
  //     stopTimer(); 
  //   }
  // }, [isAuthenticated, startTimer, stopTimer]);
  useEffect(() => {
    if (isAuthenticated) {
      console.log("sasasas")
      const sessionStartTime = localStorage.getItem("sessionStartTime");
      const currentTime = Date.now();
      const sessionLimit = 82800000; // 23 hours in milliseconds

      // If session time exceeded 23 hours, log out immediately
      if (sessionStartTime && currentTime - parseInt(sessionStartTime) >= sessionLimit) {
        handleLogout();
      } else {
        startTimers(); // Start idle + session timers
      }
    } else {
      stopTimers(); // Stop timers on logout
    }
  }, [isAuthenticated]);

  const chatHistoryApi = async() => {
      try{
          setIsChatLoading(true);
          const token = localStorage.getItem("token") || "";
          const response = await axios.get(`${prod_be_url}/grammar-chat-history`,{
              headers:{
                  Authorization: `Bearer ${token}`
              }
          })
          setChatHistory(response?.data?.data);
          setIsChatLoading(false);
  
      }catch(error){
          console.log("Error :",error);
          setIsChatLoading(false);
          setChatHistory([]);
        }
  }

  useEffect(() => {
    chatHistoryApi();
  },[isAuthenticated])

  return (
    <div >
      {/* <TextToSpeech/> */}
      <ToastNotifications/>
        <AppLayout/>
    </div>
      
  );
}

export default App;
