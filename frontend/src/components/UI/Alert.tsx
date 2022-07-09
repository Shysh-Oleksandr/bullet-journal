import React, { useEffect, useState } from 'react';
import { BiError } from 'react-icons/bi';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { setError, setSuccess } from '../../features/journal/journalSlice';
import { useAppDispatch } from './../../app/hooks';

interface AlertProps {
    message: string;
    isError: boolean;
    anotherMessage: string;
}

const Alert = ({ message, isError, anotherMessage }: AlertProps) => {
    const [isShowingAlert, setShowingAlert] = useState(false);
    const dispatch = useAppDispatch();
    const isAnotherAlertShown = anotherMessage !== '';

    useEffect(() => {
        setShowingAlert(message !== '');
        setTimeout(() => {
            if (message !== '') {
                dispatch(isError ? setError('') : setSuccess(''));
            }
        }, 3000);
    }, [message]);

    return (
        <div
            className={`fixed left-1/2 -translate-x-1/2 z-40 ${isAnotherAlertShown && !isError ? 'bottom-32' : 'bottom-12'} ${isShowingAlert ? 'alert-shown' : 'alert-hidden hidden'}`}
            onTransitionEnd={() => {
                setShowingAlert(false);
            }}
        >
            <div className={`sm:text-xl text-lg bg-white sm:px-8 px-4 sm:py-4 py-3 rounded-md flex items-center ${isError ? 'text-red-500' : 'text-green-500'} shadow-lg`}>
                <span className="mr-4 sm:text-4xl text-3xl">{isError ? <BiError /> : <IoIosCheckmarkCircle />}</span>
                <h4>{message}</h4>
            </div>
        </div>
    );
};

export default Alert;
