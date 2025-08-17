import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  bgColor?: string;
  disabledBgColor?: string;
  disabled?: boolean;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  labelProps?: {
    fontSize?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
    fontWeight?: "light" | "regular" | "medium" | "semibold" | "bold";
    color?: string;
  };
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  bgColor = "#0891b2",
  disabledBgColor = "#9ca3af",
  disabled = false,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  paddingTop = 12,
  paddingBottom = 12,
  paddingLeft = 24,
  paddingRight = 24,
  labelProps = {},
  className = "",
  type = "button",
}) => {
  const {
    fontSize = "md",
    fontWeight = "medium",
    color = "#ffffff",
  } = labelProps;

  const fontSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    xxl: "text-2xl",
    xxxl: "text-3xl",
  };

  const fontWeightClasses = {
    light: "font-light",
    regular: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const baseClasses = [
    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
    fontSizeClasses[fontSize],
    fontWeightClasses[fontWeight],
    disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:shadow-md active:scale-95",
    className,
  ].filter(Boolean).join(" ");

  const style: React.CSSProperties = {
    backgroundColor: disabled ? disabledBgColor : bgColor,
    color,
    marginTop: marginTop ? `${marginTop}px` : undefined,
    marginBottom: marginBottom ? `${marginBottom}px` : undefined,
    marginLeft: marginLeft ? `${marginLeft}px` : undefined,
    marginRight: marginRight ? `${marginRight}px` : undefined,
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
  };

  return (
    <button
      type={type}
      className={baseClasses}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
