import React from 'react';

interface IInfoMessageProps {
    message: string;
    isError: boolean;
}

const InfoMessage = ({ message, isError }: IInfoMessageProps) => {
    if (message === '') return null;
    return <small className={`text-${isError ? 'red' : 'green'}-600 text-xl`}>{message}</small>;
};

export default InfoMessage;
