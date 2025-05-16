import React from 'react';

export function Form({ children, ...props }) {
  return <form {...props}>{children}</form>;
}

export function FormField({ name, control, render }) {
  return render({
    field: {
      name,
      onChange: (e) => control?.setValue(name, e.target.value),
      value: control?.getValues(name) || '',
    },
  });
}

export function FormItem({ children, className, ...props }) {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function FormLabel({ children, className, ...props }) {
  return (
    <label className={`text-sm font-medium text-gray-700 ${className}`} {...props}>
      {children}
    </label>
  );
}

export function FormControl({ children, ...props }) {
  return <div className="mt-1" {...props}>{children}</div>;
}

export function FormMessage({ children, className, ...props }) {
  if (!children) return null;
  return (
    <p className={`text-sm text-red-500 mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function FormDescription({ children, className, ...props }) {
  return (
    <p className={`text-sm text-gray-500 ${className}`} {...props}>
      {children}
    </p>
  );
} 