import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const PublicRoute = () => {
  const { isAuthenticated, isOtpRequired } = useAuth();

  if (isOtpRequired) {
    return <Navigate to="/otp" />;
  }

  return isAuthenticated ? <Navigate to="/chat/new" /> : <Outlet />;
};

export default PublicRoute;
