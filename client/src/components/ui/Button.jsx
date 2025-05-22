import React from "react";

/**
 * A simple Button component.
 * Accepts children, className, and any native button props.
 */
export function Button({ children, className = "", ...props }) {
  const baseClasses = "px-4 py-2 rounded transition";
  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}
