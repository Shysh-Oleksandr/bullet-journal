import React from 'react';

interface LoginBtnProps {
    authenticating: boolean;
    onclick: () => void;
    icon: JSX.Element;
    isLogin: boolean;
    className: string;
    providerName: string;
}

const LoginBtn = ({ authenticating, onclick, icon, isLogin, className, providerName }: LoginBtnProps) => {
    return (
        <button
            disabled={authenticating}
            onClick={onclick}
            className={`flex items-center justify-center mx-auto text-left shadow-lg my-4 w-full sm:px-10 px-4 font-bold py-3 rounded-lg transition-all text-2xl cursor-pointer hover:shadow-xl disabled:shadow-xl disabled:cursor-default text-white ${className}`}
        >
            <span className="sm:mr-6 mr-4">{icon}</span>
            <span className="sm:text-2xl text-xl text-left">
                Sign {isLogin ? 'In' : 'Up'} with {providerName}
            </span>
        </button>
    );
};

export default LoginBtn;
