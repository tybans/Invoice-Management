import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context for auth and invoice-related data
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider to provide context to the entire app
export const AuthProvider = ({ children }) => {
  // Authentication state
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  );

  // Invoice-related state
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Save token and user to localStorage whenever they change
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

  // Function to logout and clear data
  const logout = () => {
    setToken('');
    setUser(null);
    setInvoices([]);
    setFilteredInvoices([]);
    localStorage.clear();
  };

  // Fetch invoices from the server (use axios or fetch)
  const fetchInvoices = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get('/api/invoices', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(response.data);
      setFilteredInvoices(response.data);  // Initially no filter
      setLoading(false);
    } catch (err) {
      setError('Failed to load invoices.');
      setLoading(false);
      console.error(err);
    }
  };

  // Filter invoices based on selected year
  const filterInvoicesByYear = (year) => {
    if (year) {
      const filtered = invoices.filter((invoice) => {
        const invoiceYear = new Date(invoice.invoiceDate).getFullYear();
        return invoiceYear === parseInt(year);
      });
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices);
    }
  };

  // Search invoices by invoice number
  const searchInvoicesByNumber = (invoiceNumber) => {
    if (invoiceNumber) {
      const filtered = invoices.filter((invoice) =>
        invoice.invoiceNumber.includes(invoiceNumber)
      );
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        logout,
        invoices,
        filteredInvoices,
        loading,
        error,
        fetchInvoices,
        filterInvoicesByYear,
        searchInvoicesByNumber,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
