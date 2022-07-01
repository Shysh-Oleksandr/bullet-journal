import React from 'react';

interface InputLabelProps {
    htmlFor: string;
    className?: string;
    text: string;
}

const InputLabel = ({ htmlFor, className, text }: InputLabelProps) => {
    return (
        <label htmlFor={htmlFor} className={`text-xs block text-left cursor-pointer absolute -bottom-[16px] left-1/2 -translate-x-1/2 ${className || ''}`}>
            {text}
        </label>
    );
};

export default InputLabel;
