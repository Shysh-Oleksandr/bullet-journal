import React from "react";

interface TypographyProps {
  children: React.ReactNode;
  fontSize?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
  fontWeight?: "light" | "regular" | "medium" | "semibold" | "bold";
  color?: string;
  align?: "left" | "center" | "right";
  uppercase?: boolean;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  className?: string;
  onClick?: () => void;
}

const Typography: React.FC<TypographyProps> = ({
  children,
  fontSize = "md",
  fontWeight = "regular",
  color,
  align = "left",
  uppercase = false,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  className = "",
  onClick,
}) => {
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

  const textAlignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const baseClasses = [
    fontSizeClasses[fontSize],
    fontWeightClasses[fontWeight],
    textAlignClasses[align],
    uppercase ? "uppercase" : "",
    className,
  ].filter(Boolean).join(" ");

  const style: React.CSSProperties = {
    color,
    paddingLeft: paddingLeft ? `${paddingLeft}px` : undefined,
    paddingRight: paddingRight ? `${paddingRight}px` : undefined,
    paddingTop: paddingTop ? `${paddingTop}px` : undefined,
    paddingBottom: paddingBottom ? `${paddingBottom}px` : undefined,
    marginTop: marginTop ? `${marginTop}px` : undefined,
    marginBottom: marginBottom ? `${marginBottom}px` : undefined,
    marginLeft: marginLeft ? `${marginLeft}px` : undefined,
    marginRight: marginRight ? `${marginRight}px` : undefined,
  };

  const Component = onClick ? "button" : "span";

  return (
    <Component
      className={baseClasses}
      style={style}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      {children}
    </Component>
  );
};

export default Typography;
