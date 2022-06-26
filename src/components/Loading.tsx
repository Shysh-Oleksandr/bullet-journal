import React from 'react';

interface ILoadingProps {
    scaleSize?: number;
}

const Loading = ({ scaleSize }: ILoadingProps) => {
    return (
        <div style={{ transform: `scale(${scaleSize || 1})` }} className="stage z-50">
            <div className="dot-revolution"></div>
        </div>
    );
};

export default Loading;
