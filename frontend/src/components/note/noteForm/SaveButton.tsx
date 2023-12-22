import React, { useMemo, useState } from 'react';
import { getDifferentColor, getLinearGradientStyle } from '../../../utils/functions';

interface SaveButtonProps {
  type: 'button' | 'submit' | 'reset' | undefined;
  onclick: (e: any) => void;
  disabled: boolean;
  icon: JSX.Element;
  text: string;
  bgColor: string;
  disabledBgColor: string;
  className?: string;
}

const SaveButton = ({ type, bgColor, disabledBgColor, onclick, disabled, icon, text, className }: SaveButtonProps) => {
  const [hover, setHover] = useState(false);

  const linearGradientStyle = useMemo(() => {
    const activeBgColor = hover ? getDifferentColor(bgColor, 5) : bgColor

    return getLinearGradientStyle(disabled ? disabledBgColor : activeBgColor);
  }, [bgColor, disabled, hover, disabledBgColor]);

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      type={type}
      onClick={onclick}
      disabled={disabled}
      className={`sm:text-2xl text-xl fl justify-center font-bold sm:px-8 px-6 sm:py-3 py-2 rounded-md text-white cursor-pointer shadow-md transition-all hover:shadow-lg w-full ${className}`}
      style={linearGradientStyle}
    >
      {icon} {text}
    </button>
  );
};

export default SaveButton;
