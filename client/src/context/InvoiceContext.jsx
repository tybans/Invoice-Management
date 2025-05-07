import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, setToken as saveToken, removeToken } from "../utils/utils";

const InvoiceContext = createContext();

export const useInvoiceContext = () => useContext(InvoiceContext);

export const InvoiceProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUser] = useState(null);

  const login = (newUser) => {
    saveToken(newUser.token);
    setTokenState(newUser.token);
    setUser(newUser.user); // store full user object here
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
  };

  useEffect(() => {
    // Optionally fetch user info from token
    if (token && !user) {
      // Fetch or decode user info here if needed
      // For now, we'll assume fresh login sets it.
    }
  }, [token]);

  return (
    <InvoiceContext.Provider value={{ token, user, login, logout }}>
      {children}
    </InvoiceContext.Provider>
  );
};
