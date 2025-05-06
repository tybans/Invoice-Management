import React from 'react';

const Input = ({ label, type = "text", value, onChange, placeholder, required = false }) => {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>
  );
};

export default Input;
