import React from 'react';

interface IErrorTextProps {
    error: string;
}

const ErrorText = ({ error }: IErrorTextProps) => {
    if (error === '') return null;
    return <small className="text-red-600 text-xl">{error}</small>;
};

export default ErrorText;
