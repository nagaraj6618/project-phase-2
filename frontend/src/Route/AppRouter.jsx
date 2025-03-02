import React from 'react';
import {Routes,Route} from "react-router-dom";
import Home from "../Components/Home/Home";
import Register from '../Components/Register/Register';
import Login from "../Components/Login/Login";
import PublicRoute from './PublicRoute';
import About from '../Components/About/About';
import Contact from '../Components/Contact/Contact';
import PrivateRoute from './PrivateRoute';
import OTPVerify from '../Components/OTP/OTPVerify';
import PrivateOtpRoute from './PrivateOtpRoute';
import {Navigate} from "react-router-dom"
import Account from '../Components/Account/Account';
import ForgotPassword from '../Components/ForgotPassword/ForgotPassword';
// import ReadmeViewer from '../Components/ReadmeViewer/ReadmeViewer';
// import AIChatHome from '../Components/ChatDesign/AIChatHome';
import AIChatRedirect from '../Components/ChatDesign/AIChatRedirect';
const AppRouter = () => {
  return (
    <Routes>
      
      <Route element={<PrivateRoute/>}>
        <Route path='/chat/:id' element={<Home/>}/>
        <Route path='/account' element = {<Account/>} />
        <Route path="/ai/:id" element={<AIChatRedirect/>} />
      </Route>
      <Route element={<PublicRoute/>}>
        <Route path="/signin" element={<Login/>}/>
        <Route path = "/signup" element = {<Register/>}/>
        <Route path = "/forgot-password" element = {<ForgotPassword/>} />
        
        <Route path='/' element={<Home/>}/>
        
      </Route>
      <Route element={<PrivateOtpRoute/>}>
        <Route path = "/otp" element={<OTPVerify/>} />
      </Route>
      <Route path="/about" element={<About/>}/>
      <Route path = "/contact" element = {<Contact/>}/>
      <Route path="*" element={<Navigate to="/chat/new" replace />} />
    </Routes>

  )
}

export default AppRouter