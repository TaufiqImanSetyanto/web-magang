/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Loading from "../components/Loading"

const RoleBasedRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <Loading/>;
  }
  if(!user){
    return <Navigate to="/login" />;
  }
  if (!requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RoleBasedRoutes;
