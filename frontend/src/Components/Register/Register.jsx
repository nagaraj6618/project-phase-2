import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import LoadingFull from '../Loading/LoadingFull';
import { showErrorToast, showInfoToast} from '../ToastMessage/ToastMessageComponent';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import { useAuth } from '../../Context/AuthContext';

const Register = () => {
  const {register} = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const registerHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try{
      if (password !== confirmPassword) {
        throw new Error("Password and Confirm Password do not match");
      }
      const response = await axios.post(`${prod_be_url}/auth/signup`,{
        userName:username,
        password,
        name,
        email,
      });
      console.log(response.data)
      showInfoToast("Complete the TFA");
      const responseData = response.data;
      localStorage.setItem("user",JSON.stringify(responseData?.data));
      register();
    }catch(error){
      if(error?.response?.data){
        showErrorToast(error?.response?.data?.message);
      }else{
        showErrorToast(error.message);
      }
    }
    setIsLoading(false);
    console.log('Registering with:', name, email, username, password, confirmPassword);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 p-4">
      {isLoading && <LoadingFull/>}
      
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl bg-gray-800 bg-opacity-60 backdrop-blur-lg p-10 rounded-2xl shadow-lg text-white">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={registerHandler} className="space-y-4">
          <div>
            <label className="block mb-2">Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Choose a username"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
              <span 
                className="absolute top-3 right-3 text-xl cursor-pointer text-gray-400 hover:text-white" 
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
              </span>
            </div>
          </div>
          <div>
            <label className="block mb-2">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all p-3 rounded font-semibold"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-4 text-sm">
          <p className="text-gray-300">Already have an account? <Link to="/signin" className="text-blue-400 hover:underline">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
