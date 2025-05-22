import React from 'react';

export function Button({ children, className, variant = "default", ...props }) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-green-600 text-white hover:bg-green-700";
      case "secondary":
        return "bg-gray-200 text-gray-800 hover:bg-gray-300";
      case "destructive":
        return "bg-red-600 text-white hover:bg-red-700";
      case "outline":
        return "border border-gray-300 bg-transparent hover:bg-gray-100";
      case "ghost":
        return "bg-transparent hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <button
      className={`px-4 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${getVariantStyles()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 