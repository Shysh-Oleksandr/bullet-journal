import React from 'react';
import { getDifferentColor } from '../../utils/functions';

interface NoteInfoProps {
    text: string;
    color: string;
    className?: string;
}

const NoteInfo = ({ text, color, className }: NoteInfoProps) => {
    return (
        <h4 className={`sm:px-2 px-[6px] sm:py-1 py-[2px] mr-2 mb-2 sm:text-xl text-lg inline-block rounded-md ${className}`} style={{ backgroundColor: getDifferentColor(color, 20) }}>
            {text}
        </h4>
    );
};

export default NoteInfo;
