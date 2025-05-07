import React from "react";
import { Navigate } from "react-router-dom";
import { useInvoiceContext } from "../context/InvoiceContext";

const RedirectBasedOnRole = () => {
  const { user } = useInvoiceContext();

  if (!user) return <Navigate to="/login" />;

  if (user.role === "admin") return <Navigate to="/users" />;
  if (user.role === "unit manager" || user.role === "user") return <Navigate to="/invoices" />;

  return <Navigate to="/login" />;
};

export default RedirectBasedOnRole;
