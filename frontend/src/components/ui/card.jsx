export function Card({ children, ...props }) {
  return <div className="bg-white shadow-md rounded-2xl p-4" {...props}>{children}</div>;
}

export function CardContent({ children, ...props }) {
  return <div className="p-2" {...props}>{children}</div>;
}
