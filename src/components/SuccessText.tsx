import React from 'react';

interface ISuccessTextProps {
    success: string;
}

const SuccessText = ({ success }: ISuccessTextProps) => {
    if (success === '') return null;
    return <small className="text-green-600 text-xl">{success}</small>;
};

export default SuccessText;
