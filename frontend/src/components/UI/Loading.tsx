import React from 'react';

interface ILoadingProps {
    scaleSize?: number;
    className?: string;
}

const Loading = ({ scaleSize, className }: ILoadingProps) => {
    return (
        <div className={`flex justify-center items-center w-full h-full ${className}`}>
            <div style={{ transform: `scale(${scaleSize || 1})` }} className="stage z-50 !py-16">
                <div className="dot-revolution"></div>
            </div>
        </div>
    );
};

export default Loading;
