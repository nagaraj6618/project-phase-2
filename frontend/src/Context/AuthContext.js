import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("auth") === "true"
  );
  const [isOtpRequired, setIsOtpRequired] = useState(
    localStorage.getItem("otpRequired") === "true"
  );
  const [isChatLoading ,setIsChatLoading] = useState(true);
  const [chatHistory,setChatHistory] = useState([]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem("auth") === "true");
      setIsOtpRequired(localStorage.getItem("otpRequired") === "true");
    };
    // setChatHistory([])

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = () => {
    localStorage.setItem("otpRequired", "true");
    setIsOtpRequired(true);
  };

  const register = () => {
    localStorage.setItem("otpRequired", "true");
    setIsOtpRequired(true);
  };

  const verifyOtp = () => {
    localStorage.setItem("auth", "true");
    localStorage.setItem("sessionStartTime", Date.now().toString());
    localStorage.removeItem("otpRequired");
    setIsAuthenticated(true);
    setIsOtpRequired(false);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("otpRequired");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("sessionStartTime");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setIsOtpRequired(false);
    setChatHistory([])
  };

  const setChatHistoryData = (data) => {
    console.log(data)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isOtpRequired, login, register, verifyOtp, logout, chatHistory,setChatHistoryData,setChatHistory,isChatLoading,setIsChatLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
