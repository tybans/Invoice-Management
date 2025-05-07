import { Navigate } from "react-router-dom";
import { getToken } from "../utils/utils";

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to="/" />;
};

export default PrivateRoute;
