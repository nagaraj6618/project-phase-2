import React, { useEffect, useState } from 'react';
import { showErrorToast, showSuccessToast } from '../ToastMessage/ToastMessageComponent';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import { motion } from 'framer-motion';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';

const Account = () => {
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem("userData");
    return savedData ? JSON.parse(savedData) : {
      name: "",
      userName: "",
      email: "",
      role: "",
      verified: false,
    };
  });
  const [loading, setLoading] = useState(!localStorage.getItem("userData"));
  const [changePassword, setChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const response = await axios.get(`${prod_be_url}/auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data?.data);
      localStorage.setItem("userData", JSON.stringify(response.data?.data));
    } catch (error) {
      // showErrorToast(error.message);
      if(error?.response?.data){
              showErrorToast(error?.response?.data?.message);
            }
            else{
              showErrorToast(error.message);
            }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    setChangePassword(true);
  };

  const handleCancel = () => {
    setChangePassword(false);
  };

  const handleSubmitPassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    if (newPassword !== confirmPassword) {
      showErrorToast("New password and confirm password must be the same.");
      return;
    }
    if (currentPassword === newPassword) {
      showErrorToast("New password cannot be the same as the current password.");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token") || "";
      await axios.post(`${prod_be_url}/auth/reset-password`, {
        oldpassword: currentPassword,
        newpassword: newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showSuccessToast("Password changed successfully.");
      setChangePassword(false);
    } catch (error) {
      if(error?.response?.data){
              showErrorToast(error?.response?.data?.message);
            }
            else{
              showErrorToast(error.message);
            }
    } finally {
      setSubmitting(false);
      setPasswordData({
        currentPassword:"",
        confirmPassword:"",
        newPassword:""
      })
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="h-screen flex items-center justify-center bg-gray-900 text-white p-6"
    >
      {loading ? (
        <motion.div 
          initial={{ scale: 0.5 }} 
          animate={{ scale: 1 }} 
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center"
        >
          <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium mt-3">Loading account...</p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ y: -10, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-700"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-400">Account Details</h2>
          {!changePassword ? (
            <div className="space-y-3 text-base">
              <p className="flex justify-between border-b border-gray-700 pb-2"><span className="font-medium text-blue-400">Name:</span> <span>{userData.name}</span></p>
              <p className="flex justify-between border-b border-gray-700 pb-2"><span className="font-medium text-blue-400">Username:</span> <span>{userData.userName}</span></p>
              <p className="flex justify-between border-b border-gray-700 pb-2"><span className="font-medium text-blue-400">Email:</span> <span>{userData.email}</span></p>
              <p className="flex justify-between border-b border-gray-700 pb-2"><span className="font-medium text-blue-400">Role:</span> <span>{userData.role}</span></p>
              <p className="flex justify-between border-b border-gray-700 pb-2"><span className="font-medium text-blue-400">Active:</span> <span>{userData.verified?"Yes":"No"}</span></p>
              <button 
                onClick={handleChangePassword} 
                className="w-full mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded text-white font-medium"
              >
                Change Password
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {['current', 'new', 'confirm'].map((type) => (
                <div key={type} className="relative">
                  <input 
                    type={showPassword[type] ? "text" : "password"} 
                    value={passwordData[type + 'Password']}
                    onChange={(e) => setPasswordData({ ...passwordData, [type + 'Password']: e.target.value })}
                    placeholder={
                      type === 'current' ? "Current Password" : 
                      type === 'new' ? "New Password" : "Confirm Password"
                    }
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword((prev) => ({ ...prev, [type]: !prev[type] }))}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-400"
                  >
                    {showPassword[type] ? <IoIosEyeOff size={20} /> : <IoIosEye size={20} />}
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <button 
                  onClick={handleSubmitPassword}
                  className="flex-1 mt-4 py-2 px-4 bg-green-500 hover:bg-green-600 rounded text-white font-medium"
                  disabled={submitting}
                >
                  {submitting ? "Processing..." : "Submit"}
                </button>
                <button 
                  onClick={handleCancel} 
                  className="flex-1 mt-4 py-2 px-4 bg-red-500 hover:bg-red-600 rounded text-white font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Account;
