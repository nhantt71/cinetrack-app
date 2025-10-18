import React, { useState, useRef, useEffect } from "react";

export function Select({ value: controlledValue, defaultValue, onValueChange, children }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue || "");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;
  const handleChange = (val) => {
    if (!isControlled) setUncontrolled(val);
    onValueChange && onValueChange(val);
  };

  const childArray = React.Children.toArray(children);
  const triggerChild = childArray.find((c) => React.isValidElement(c) && c.type && c.type.name === "SelectTrigger");
  const contentChild = childArray.find((c) => React.isValidElement(c) && c.type && c.type.name === "SelectContent");

  const label = triggerChild?.props?.children;
  const menu = contentChild?.props?.children;

  // Render a single trigger that owns the floating content; do not render standalone content at root
  return (
    <SelectTrigger value={value} handleChange={handleChange} label={label}>
      <SelectContent handleChange={handleChange}>
        {menu}
      </SelectContent>
    </SelectTrigger>
  );
}

export function SelectTrigger({ value, handleChange, label, children }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="relative" ref={triggerRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-40 flex justify-between items-center bg-secondary/60 text-foreground border border-border px-4 py-2 rounded-lg hover:bg-secondary transition"
      >
        <span className="truncate">{label || value}</span>
        <span className="text-muted-foreground ml-2">▼</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 w-full bg-card border border-border mt-2 rounded-lg shadow-lg z-10">
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null;
            return React.cloneElement(child, {
              handleChange: (val) => {
                handleChange(val);
                setOpen(false);
              },
            });
          })}
        </div>
      )}
    </div>
  );
}

export function SelectContent({ children, handleChange }) {
  const items = React.Children.toArray(children).map((child, idx) =>
    React.isValidElement(child) ? React.cloneElement(child, { key: idx, handleChange }) : child
  );
  return <div className="flex flex-col">{items}</div>;
}

export function SelectItem({ value, handleChange, children }) {
  return (
    <button
      onClick={() => handleChange(value)}
      className="px-4 py-2 text-left text-foreground hover:bg-primary hover:text-white transition"
    >
      {children}
    </button>
  );
}

export function SelectValue({ children }) {
  return <span className="text-muted-foreground">{children}</span>;
}
