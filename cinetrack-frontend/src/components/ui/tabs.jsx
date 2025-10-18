import React, { useState } from "react";

export function Tabs({ defaultValue, children, className = "" }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const childArray = React.Children.toArray(children);

  const content = childArray.map((child) => {
    if (child.type && child.type.name === "TabsList") {
      return React.cloneElement(child, { key: "tabs-list", activeTab, setActiveTab });
    }
    if (child.type && child.type.name === "TabsContent") {
      return React.cloneElement(child, { key: child.props.value, activeTab });
    }
    return null;
  });

  return <div className={`w-full ${className}`}>{content}</div>;
}

export function TabsList({ children, activeTab, setActiveTab, className = "" }) {
  const items = React.Children.toArray(children).map((child, idx) =>
    React.cloneElement(child, { key: idx, activeTab, setActiveTab })
  );
  return (
    <div className={`flex gap-6 border-b border-border/60 mb-4 ${className}`}>{items}</div>
  );
}

export function TabsTrigger({ value, children, activeTab, setActiveTab }) {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-1 py-3 -mb-px text-sm font-medium transition relative ${
        isActive
          ? "text-white after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[1px] after:h-[2px] after:bg-primary"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, activeTab, children }) {
  if (activeTab !== value) return null;
  return <div>{children}</div>;
}
