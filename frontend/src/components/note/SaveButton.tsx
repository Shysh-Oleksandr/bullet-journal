import React from 'react';

interface SaveButtonProps {
    type: 'button' | 'submit' | 'reset' | undefined;
    onclick: (e: any) => void;
    disabled: boolean;
    icon: JSX.Element;
    text: string;
    className: string;
}

const SaveButton = ({ type, onclick, disabled, icon, text, className }: SaveButtonProps) => {
    return (
        <button
            type={type}
            onClick={onclick}
            disabled={disabled}
            className={`sm:text-2xl text-xl fl justify-center font-bold sm:px-8 px-6 sm:py-3 py-2 rounded-md text-white cursor-pointer shadow-md transition-all hover:shadow-lg w-full ${className}`}
        >
            {icon} {text}
        </button>
    );
};

export default SaveButton;
