import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useInvoiceContext } from "../context/InvoiceContext";

const Header = () => {
  const { logout } = useInvoiceContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">Invoice Manager</h1>
      <nav className="flex gap-4">
        <Link to="/invoices" className="text-gray-700 hover:text-blue-600">
          Invoices
        </Link>
        <Link to="/users" className="text-gray-700 hover:text-blue-600">
          Users
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
