import React, { useState, useEffect } from "react";
import axios from "axios";
import { prod_be_url } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../ToastMessage/ToastMessageComponent";
import { useAuth } from "../../Context/AuthContext";

const ForgotPassword = () => {
   const { verifyOtp } = useAuth();
   const [step, setStep] = useState(1);
   const [email, setEmail] = useState("");
   const [otp, setOtp] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [isEmailDisabled, setIsEmailDisabled] = useState(false);
   const [loading, setLoading] = useState(false);
   const [resendDisabled, setResendDisabled] = useState(true);
   const [timer, setTimer] = useState(120);

   useEffect(() => {
      let interval;
      if (step === 2 && resendDisabled) {
         interval = setInterval(() => {
            setTimer((prev) => {
               if (prev === 1) {
                  clearInterval(interval);
                  setResendDisabled(false);
                  return 0;
               }
               return prev - 1;
            });
         }, 1000);
      }
      return () => clearInterval(interval);
   }, [step, resendDisabled]);

   const triggerOtp = async () => {
      setLoading(true);
      try {
         const response = await axios.post(`${prod_be_url}/auth/new-password`, { emailorusername: email });
         if (response?.data?.success) {
            setIsEmailDisabled(true);
            setStep(2);
            setResendDisabled(true);
            setTimer(120);
            showSuccessToast("OTP sent to registered email.");
            console.log(response.data);
            localStorage.setItem("user", JSON.stringify(response?.data?.data));
         }
      } catch (error) {
         console.error("Error triggering OTP", error);
         showErrorToast("Error triggering OTP")
      }
      setLoading(false);
   };

   const verifyOtpHandler = async () => {
      setLoading(true);
      try {
         const user = JSON.parse(localStorage.getItem("user") || "null");
         const response = await axios.post(`${prod_be_url}/auth/otp-verify/${user.id}`, {  otp,type:"create new password" });
         if (response?.data?.success) {
            setStep(3);
            showSuccessToast("TFA Completed Successfully")
         }
      } catch (error) {
         console.error("Error verifying OTP", error);
         if (error?.response?.data) {
            showErrorToast(error?.response?.data?.message);
         } else {
            showErrorToast(error.message);
         }
      }
      setLoading(false);
   };

   const resetPassword = async () => {
      setLoading(true);
      try {
         const user = JSON.parse(localStorage.getItem("user") || "null");
         const response = await axios.post(`${prod_be_url}/auth/otp-verify/${user.id}`, {  otp,password:newPassword });
         if (response?.data?.success) {
            showSuccessToast("Password reset successful!");
            setStep(1);
            setEmail("");
            setOtp("");
            setNewPassword("");
            setIsEmailDisabled(false);
            console.log(response.data);
            localStorage.setItem("token" ,response?.data?.token);
            verifyOtp()
         }
      } catch (error) {
         console.error("Error resetting password", error);
         if (error?.response?.data) {
            showErrorToast(error?.response?.data?.message);
         } else {
            showErrorToast(error.message);
         }
      }
      setLoading(false);
   };

   return (
      <div className="flex items-center justify-center h-screen bg-gray-900 p-4">
         <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl bg-gray-800 bg-opacity-60 backdrop-blur-lg p-10 rounded-2xl shadow-lg text-white">
            <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
            <div className="space-y-4">
               <input
                  type="text"
                  placeholder="Enter Email/Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isEmailDisabled}
                  className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
               {step === 2 && (
                  <>
                     <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     {resendDisabled ? (
                        <p className="text-gray-400 text-center">Resend OTP in {timer}s</p>
                     ) : (
                        <p className="text-blue-400 text-center cursor-pointer" onClick={triggerOtp}>Resend OTP</p>
                     )}
                  </>
               )}
               {step === 3 && (
                  <input
                     type="password"
                     placeholder="Enter New Password"
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                     className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
               )}
               {step === 1 ? (
                  <button onClick={triggerOtp} disabled={!email || loading} className="w-full bg-blue-600 hover:bg-blue-700 transition-all p-3 rounded font-semibold flex items-center justify-center">
                     {loading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span> : "Next"}
                  </button>
               ) : step === 2 ? (
                  <button onClick={verifyOtpHandler} disabled={!otp || loading} className="w-full bg-blue-600 hover:bg-blue-700 transition-all p-3 rounded font-semibold flex items-center justify-center">
                     {loading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span> : "Verify"}
                  </button>
               ) : (
                  <button onClick={resetPassword} disabled={!newPassword || loading} className="w-full bg-green-600 hover:bg-green-700 transition-all p-3 rounded font-semibold flex items-center justify-center">
                     {loading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span> : "Reset Password"}
                  </button>
               )}
            </div>
         </div>
      </div>
   );
};

export default ForgotPassword