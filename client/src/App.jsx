import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import InvoiceDashboard from "./pages/InvoiceDashboard";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";
import { useInvoiceContext } from "./context/InvoiceContext";
import Header from "./components/Header";
import Register from "./pages/Register";

const App = () => {
  const { user } = useInvoiceContext();

  const getInitialRoute = () => {
    if (user?.role === "ADMIN") return "/users";
    if (user?.role === "UNIT MANAGER" || user?.role === "USER") return "/invoices";
    return "/signup"; // default for non-authenticated users
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to={getInitialRoute()} />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/invoices"
          element={
            user ? <InvoiceDashboard /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/users"
          element={
            user ? <UserDashboard /> : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
