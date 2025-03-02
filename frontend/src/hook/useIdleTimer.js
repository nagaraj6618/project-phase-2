// import { useEffect, useRef } from "react";

// const useIdleTimer = (onIdle, timeout = 1800000) => { // 30 minutes default
//   const timer = useRef(null);

//   const startTimer = () => {
//     if (timer.current) clearTimeout(timer.current);
//     timer.current = setTimeout(onIdle, timeout);
//   };

//   const stopTimer = () => {
//     if (timer.current) clearTimeout(timer.current);
//   };

//   useEffect(() => {
//     const handleActivity = () => startTimer();

//     window.addEventListener("mousemove", handleActivity);
//     window.addEventListener("keydown", handleActivity);
//     window.addEventListener("click", handleActivity);
//     window.addEventListener("scroll", handleActivity);

//     return () => {
//       window.removeEventListener("mousemove", handleActivity);
//       window.removeEventListener("keydown", handleActivity);
//       window.removeEventListener("click", handleActivity);
//       window.removeEventListener("scroll", handleActivity);
//       stopTimer();
//     };
//   }, []);

//   return { startTimer, stopTimer };
// };

// export default useIdleTimer;


import { useEffect, useRef } from "react";
import { showInfoToast } from "../Components/ToastMessage/ToastMessageComponent";

const useIdleTimer = (onIdle, timeout = 1800000, sessionLimit = 82800000) => { 
  // 30 min inactivity = 1800000ms
  // 23 hours session = 82800000ms

  const idleTimer = useRef(null);
  const sessionTimer = useRef(null);

  const startTimers = () => {
    const sessionStartTime = localStorage.getItem("sessionStartTime");

    if (!sessionStartTime) {
      localStorage.setItem("sessionStartTime", Date.now().toString());

    }

    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (sessionTimer.current) clearTimeout(sessionTimer.current);

    // Idle timer (resets on user activity)
    idleTimer.current = setTimeout(onIdle, timeout);

    sessionTimer.current = setTimeout(() => {
     
      onIdle();
    }, sessionLimit);
  };

  const stopTimers = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (sessionTimer.current) clearTimeout(sessionTimer.current);
    localStorage.removeItem("sessionStartTime"); // Clear session on logout
  };

  useEffect(() => {
    const handleActivity = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(onIdle, timeout);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      stopTimers();
    };
  }, []);

  return { startTimers, stopTimers };
};

export default useIdleTimer;
