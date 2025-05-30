import { createContext, useContext } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  return (
    <AuthContext.Provider value={{ user, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const RequireAuth = () => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return (
      <Navigate
        to={{ pathname: "/login", state: { from: location } }}
        replace
      />
    );
  }
  return <Outlet />;
};
