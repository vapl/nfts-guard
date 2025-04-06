import React from "react";

interface BadgeProps {
  name: string;
  size?: "sm" | "lg" | "xl";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ name, size = "sm", className }) => {
  const sizeStyles = {
    sm: "text-xs px-3 py-0.5",
    lg: "text-sm px-4 py-1",
    xl: "text-base px-5 py-1.5",
  };

  return (
    <span
      className={`bg-purple-700 bg-opacity-20 text-white rounded-full uppercase tracking-wider font-semibold ${sizeStyles[size]} ${className}`}
    >
      {name}
    </span>
  );
};

export default Badge;
