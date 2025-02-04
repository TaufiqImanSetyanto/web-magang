/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/auth", { withCredentials: true });
        setUser(data.user);
      } catch (error) {
        console.error("Error verifying token:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  const login = async (user) => {
    setUser(user);
  };
  const logout = async () => {
    await axios.get("http://localhost:4000/auth/logout", { withCredentials: true });
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
};
