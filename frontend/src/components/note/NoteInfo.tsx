import React from 'react';
import { getDifferentColor } from '../../utils/functions';

interface NoteInfoProps {
    text: string;
    color: string;
    className?: string;
}

const NoteInfo = ({ text, color, className }: NoteInfoProps) => {
    return (
        <h4 className={`px-2 py-1 inline-block rounded-md ${className}`} style={{ backgroundColor: getDifferentColor(color, 20) }}>
            {text}
        </h4>
    );
};

export default NoteInfo;
