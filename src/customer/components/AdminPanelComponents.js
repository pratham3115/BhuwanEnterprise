// // AdminPanelComponents.jsx
// import React, { useEffect } from "react";

// // Utility Components
// export const Button = ({ children, onClick, disabled, variant = "primary", size = "md", className = "" }) => {
//   const baseStyle = "font-semibold rounded focus:outline-none transition-colors";
//   const sizeClasses = {
//     sm: "px-2 py-1 text-sm",
//     md: "px-4 py-2",
//     lg: "px-6 py-3 text-lg",
//   };
//   const variantClasses = {
//     primary: "bg-blue-500 text-white hover:bg-blue-600",
//     secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
//     destructive: "bg-red-500 text-white hover:bg-red-600",
//   };

//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={`${baseStyle} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
//     >
//       {children}
//     </button>
//   );
// };

// export const Input = ({ id, name, value, onChange, type = "text", placeholder, required, accept }) => (
//   <input
//     id={id}
//     name={name}
//     value={value}
//     onChange={onChange}
//     type={type}
//     placeholder={placeholder}
//     required={required}
//     accept={accept}
//     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//   />
// );

// export const Label = ({ htmlFor, children }) => (
//   <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
//     {children}
//   </label>
// );

// export const Textarea = ({ id, name, value, onChange, placeholder }) => (
//   <textarea
//     id={id}
//     name={name}
//     value={value}
//     onChange={onChange}
//     placeholder={placeholder}
//     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//     rows="3"
//   />
// );

// export const Card = ({ children, className = "" }) => (
//   <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>{children}</div>
// );

// export const CardHeader = ({ children }) => <div className="px-6 py-4 border-b">{children}</div>;

// export const CardContent = ({ children }) => <div className="px-6 py-4">{children}</div>;

// export const CardTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;

// export const Switch = ({ id, checked, onChange }) => (
//   <label htmlFor={id} className="flex items-center cursor-pointer">
//     <div className="relative">
//       <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
//       <div className={`block w-14 h-8 rounded-full ${checked ? "bg-blue-500" : "bg-gray-300"}`}></div>
//       <div
//         className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${checked ? "transform translate-x-6" : ""}`}
//       ></div>
//     </div>
//   </label>
// );

// export const Tabs = ({ children }) => <div className="mb-4">{children}</div>;

// export const TabsList = ({ children }) => <div className="flex border-b">{children}</div>;

// export const TabsTrigger = ({ children, isActive, onClick }) => (
//   <button
//     className={`px-4 py-2 font-semibold ${
//       isActive ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-700"
//     }`}
//     onClick={onClick}
//   >
//     {children}
//   </button>
// );

// export const TabsContent = ({ children, isActive }) => <div className={isActive ? "block" : "hidden"}>{children}</div>;

// export const Toast = ({ message, type = "success", onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 3000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div
//       className={`fixed bottom-4 right-4 px-4 py-2 rounded-md text-white ${
//         type === "success" ? "bg-green-500" : "bg-red-500"
//       }`}
//     >
//       {message}
//     </div>
//   );
// };
