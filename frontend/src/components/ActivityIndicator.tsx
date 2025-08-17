import React from "react";

interface ActivityIndicatorProps {
  size?: "small" | "large";
  color?: string;
  className?: string;
}

const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  size = "large",
  color = "#0891b2",
  className = "",
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    large: "w-8 h-8",
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div
        className="w-full h-full border-2 border-gray-200 border-t-current rounded-full animate-spin"
        style={{ borderTopColor: color }}
      />
    </div>
  );
};

export default ActivityIndicator;
