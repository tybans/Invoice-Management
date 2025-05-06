import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">User & Invoice Management</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm">Role: {user?.role}</span>
        <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
