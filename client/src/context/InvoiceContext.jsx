// InvoiceContext.jsx
import React, { createContext, useContext, useState } from "react";
import { getToken, setToken, removeToken } from "../utils/utils";

const InvoiceContext = createContext();

export const useInvoiceContext = () => useContext(InvoiceContext);

export const InvoiceProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => getToken());

  const login = (newToken) => {
    setToken(newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
  };

  return (
    <InvoiceContext.Provider value={{ token, login, logout }}>
      {children}
    </InvoiceContext.Provider>
  );
};
