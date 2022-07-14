import React from 'react';

interface ICenterPieceProps {
    children: JSX.Element;
}

const CenterPiece = (props: ICenterPieceProps) => {
    return <div className="flex w-full h-full justify-center">{props.children}</div>;
};

export default CenterPiece;
