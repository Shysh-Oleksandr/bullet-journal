import React from 'react';

interface IInfoMessageProps {
    message: string;
    isError: boolean;
}

const InfoMessage = ({ message, isError }: IInfoMessageProps) => {
    if (message === '') return null;
    return <small className={`${isError ? 'text-red-600' : 'text-green-600'} text-xl my-2 block`}>{message}</small>;
};

export default InfoMessage;
