export function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-block bg-gray-800 text-gray-200 text-sm px-3 py-1 rounded-full ${className}`}
    >
      {children}
    </span>
  );
}
