import React, { useEffect, useState } from 'react';
import { BiError } from 'react-icons/bi';
import { IoIosCheckmarkCircle } from 'react-icons/io';

interface AlertProps {
    message: string;
    isError: boolean;
}

const Alert = ({ message, isError }: AlertProps) => {
    const [isShowingAlert, setShowingAlert] = useState(false);

    useEffect(() => {
        setShowingAlert(message !== '');
    }, [message]);

    return (
        <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-40 ${isShowingAlert ? 'alert-shown' : 'alert-hidden'}`} onTransitionEnd={() => setShowingAlert(false)}>
            <div className={`text-xl bg-white px-8 py-4 rounded-md flex items-center ${isError ? 'text-red-500' : 'text-green-500'} shadow-md`}>
                <span className="mr-4 text-4xl">{isError ? <BiError /> : <IoIosCheckmarkCircle />}</span>
                <h4>{message}</h4>
            </div>
        </div>
    );
};

export default Alert;
