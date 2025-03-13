import React, { useEffect } from "react";
import PropTypes from "prop-types";

export const Button = ({ children, onClick, disabled, variant = "primary", size = "md", className = "" }) => {
  const baseStyle = "font-semibold rounded focus:outline-none transition-colors";
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(["primary", "secondary", "destructive"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
};

export const Input = ({ id, name, value, onChange, type = "text", placeholder, required, accept }) => (
  <input
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    type={type}
    placeholder={placeholder}
    required={required}
    accept={accept}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  accept: PropTypes.string,
};

export const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

Label.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export const Textarea = ({ id, name, value, onChange, placeholder }) => (
  <textarea
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    rows="3"
  />
);

Textarea.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>{children}</div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardHeader = ({ children }) => <div className="px-6 py-4 border-b">{children}</div>;

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export const CardContent = ({ children }) => <div className="px-6 py-4">{children}</div>;

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
};

export const CardTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export const Switch = ({ id, checked, onChange }) => (
  <label htmlFor={id} className="flex items-center cursor-pointer">
    <div className="relative">
      <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div className={`block w-14 h-8 rounded-full ${checked ? "bg-blue-500" : "bg-gray-300"}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${checked ? "transform translate-x-6" : ""}`}></div>
    </div>
  </label>
);

Switch.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const Tabs = ({ children }) => <div className="mb-4">{children}</div>;

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TabsList = ({ children }) => <div className="flex border-b">{children}</div>;

TabsList.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TabsTrigger = ({ children, isActive, onClick }) => (
  <button className={`px-4 py-2 font-semibold ${isActive ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-700"}`} onClick={onClick}>
    {children}
  </button>
);

TabsTrigger.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

export const TabsContent = ({ children, isActive }) => <div className={isActive ? "block" : "hidden"}>{children}</div>;

TabsContent.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
};

export const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-md text-white ${type === "success" ? "bg-green-500" : "bg-red-500"}`}>
      {message}
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error"]),
  onClose: PropTypes.func.isRequired,
};
