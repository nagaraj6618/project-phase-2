import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const PrivateOtpRoute = () => {
   const { isOtpRequired } = useAuth();
   return isOtpRequired ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateOtpRoute