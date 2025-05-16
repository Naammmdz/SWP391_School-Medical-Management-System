import React from 'react';

export function Tabs({ children, value, onValueChange, className }) {
  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            value,
            onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, className, ...props }) {
  return (
    <div
      className={`flex flex-wrap gap-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ children, value, onValueChange, className, currentValue, ...props }) {
  const isActive = currentValue === value;
  
  return (
    <button
      className={`px-3 py-1.5 text-sm font-medium rounded transition-all 
        ${isActive 
          ? 'bg-gray-900 text-white shadow-sm' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        } ${className}`}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, currentValue, className, ...props }) {
  if (currentValue !== value) return null;
  
  return (
    <div
      className={`mt-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
} 