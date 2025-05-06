import React, { createContext, useContext, useState, useEffect } from 'react';

const InvoiceContext = createContext();

// Custom hook to use the context easily
export const useInvoice = () => useContext(InvoiceContext);

export const InvoiceProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  );

  // Save token and user info to localStorage whenever they change
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Logout function to clear everything
  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.clear();
  };

  return (
    <InvoiceContext.Provider value={{ token, setToken, user, setUser, logout }}>
      {children}
    </InvoiceContext.Provider>
  );
};
