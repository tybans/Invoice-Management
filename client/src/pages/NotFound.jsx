import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-4 text-gray-600">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/login" className="text-blue-600 underline">Back to Login</Link>
    </div>
  );
};

export default NotFound;
