/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Cookies from "js-cookie";
import Loading from "../components/Loading"

const RoleBasedRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const token = Cookies.get("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  if (loading) {
    return <Loading/>;
  }
  if (!requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RoleBasedRoutes;
