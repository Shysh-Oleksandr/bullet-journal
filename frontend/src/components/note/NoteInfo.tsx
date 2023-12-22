import React, { useMemo } from 'react';
import { getDifferentColor } from '../../utils/functions';

interface NoteInfoProps {
  text: string | JSX.Element;
  color: string;
  className?: string;
}

const NoteInfo = ({ text, color, className }: NoteInfoProps) => {
  const [backgroundColor, textColor] = useMemo(
    () => [getDifferentColor(color, 12), getDifferentColor(color, 100)],
    [color],
  );

  return (
    <h4 className={`sm:px-2 px-[6px] sm:py-1 py-[2px] mr-2 mb-2 sm:text-xl text-lg inline-block rounded-md max-h-9 ${className}`} style={{ backgroundColor, color: textColor }}>
      {text}
    </h4>
  );
};

export default NoteInfo;
