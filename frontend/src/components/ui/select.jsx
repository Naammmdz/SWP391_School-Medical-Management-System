import React, { useState } from 'react';

export function Select({ children, onValueChange, defaultValue }) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || '');

  const handleSelect = (newValue) => {
    setValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            value,
          });
        }
        if (child.type === SelectContent) {
          return isOpen && React.cloneElement(child, {
            onSelect: handleSelect,
          });
        }
        return child;
      })}
    </div>
  );
}

export function SelectTrigger({ children, onClick, className, ...props }) {
  return (
    <button
      type="button"
      className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md bg-white hover:bg-gray-50 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectValue({ children, placeholder }) {
  return <span>{children || placeholder}</span>;
}

export function SelectContent({ children, onSelect, className, ...props }) {
  return (
    <div
      className={`absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10 ${className}`}
      {...props}
    >
      {React.Children.map(children, child => {
        if (child.type === SelectItem) {
          return React.cloneElement(child, {
            onSelect,
          });
        }
        return child;
      })}
    </div>
  );
}

export function SelectItem({ children, value, onSelect, className, ...props }) {
  return (
    <div
      className={`px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer ${className}`}
      onClick={() => onSelect?.(value)}
      {...props}
    >
      {children}
    </div>
  );
} 