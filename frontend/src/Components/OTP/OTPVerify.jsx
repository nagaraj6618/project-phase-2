
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { prod_be_url } from '../../utils/config';
import { showErrorToast, showSuccessToast, } from '../ToastMessage/ToastMessageComponent';
import {useAuth} from "../../Context/AuthContext";
import LoadingFull from '../Loading/LoadingFull';

const OTPVerify = () => {
  const {verifyOtp} = useAuth();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const[isLoading,setIsLoading] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setOtp(value);
  };

  const handleResend = async() => {
    setOtp('');
    setTimer(120);
    setIsResendDisabled(true);
    try{
      const user = JSON.parse(localStorage.getItem("user")||"null");
      console.log(user);
      const response = await axios.post(`${prod_be_url}/auth/resend-otp`,{
        email:user?.email,
      })
      console.log(response.data);

    }catch(error){
      if (error?.response?.data) {
        showErrorToast(error?.response?.data?.message);
      }else{
       showErrorToast(error.message);
      }
    }
  };
  const handleOtpSubmit = async () => {
   setIsLoading(true);
   try {
     const userData = JSON.parse(localStorage.getItem("user") || "null");
     if (userData) {
       const response = await axios.post(`${prod_be_url}/auth/otp-verify/${userData.id}`, {
         otp,
       });
 
       
       console.log("OTP Verified", response.data);
 
       localStorage.setItem("token", response.data?.token);
 
       verifyOtp();
       console.log("Authentication updated");
 
       setTimeout(() => {
         showSuccessToast("Login Successful...");
         // navigate("/chat/new", { replace: true });
       }, 500);
 
     } else {
       console.log("User data not found in localStorage");
     }
     setIsLoading(false);
   } catch (error) {
     console.log("Error:", error);
     if (error?.response?.data) {
       showErrorToast(error?.response?.data?.message);
     }else{
      showErrorToast(error.message);
     }
     
     setIsLoading(false);
   }
 };
 
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">

      {
         isLoading && <LoadingFull/>
      }
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 text-center">
        <h2 className="text-xl font-semibold mb-4">OTP Verification</h2>
        <input
          type="text"
          value={otp}
          onChange={handleChange}
          maxLength="4"
          className="w-full p-2 text-center text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter OTP"
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md mt-4 disabled:bg-gray-500"
          disabled={otp.length < 4}
          onClick={handleOtpSubmit}
        >
          Submit
        </button>
        <div className="mt-4 text-sm">
          {isResendDisabled ? (
            <span className="text-gray-400">Resend OTP in {timer}s</span>
          ) : (
            <button onClick={handleResend} className="text-blue-400 hover:underline">
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;
