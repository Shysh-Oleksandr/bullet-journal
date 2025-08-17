import React from "react";

interface ProgressBarProps {
  percentageCompleted: number;
  height?: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentageCompleted,
  height = 8,
  className = "",
}) => {
  return (
    <div className={`w-full bg-gray-200 ${className}`} style={{ height }}>
      <div
        className="h-full transition-all duration-300 ease-out bg-gradient-to-r from-cyan-500 to-cyan-700"
        style={{
          width: `${percentageCompleted}%`,
        }}
      />
    </div>
  );
};

export default ProgressBar;
