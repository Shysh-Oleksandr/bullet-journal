import React from "react";

interface HeaderBarProps {
  title: string;
  trailingContent?: (textColor: string) => React.ReactNode;
  leadingContent?: (textColor: string) => React.ReactNode;
  className?: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  trailingContent,
  leadingContent,
  className = "",
}) => {
  const textColor = "#ffffff";

  return (
    <div className={`bg-cyan-700 text-white px-4 py-4 shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        {leadingContent && (
          <div className="flex items-center space-x-2">
            {leadingContent(textColor)}
          </div>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
        {trailingContent && (
          <div className="flex items-center space-x-2">
            {trailingContent(textColor)}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderBar;
