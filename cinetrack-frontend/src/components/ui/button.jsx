export function Button({ children, onClick, className = "", variant = "default", size = "md", ...props }) {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none";

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
    icon: "h-9 w-9 p-0",
  };

  const variants = {
    default: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
    outline: "border border-white/20 text-white hover:bg-white/10",
    ghost: "bg-transparent text-foreground hover:bg-white/10",
  };

  const classes = [base, sizes[size] || sizes.md, variants[variant] || variants.default, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
}
