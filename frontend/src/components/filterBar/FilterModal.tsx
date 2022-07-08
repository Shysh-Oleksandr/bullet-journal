import React from 'react';
import { useWindowSize } from '../../hooks';

interface FilterModalProps {
    modalRef: React.MutableRefObject<HTMLDivElement>;
    optionRef: React.MutableRefObject<HTMLDivElement>;
    content: JSX.Element | string;
}

const FilterModal = ({ modalRef, content, optionRef }: FilterModalProps) => {
    const [width] = useWindowSize();

    return (
        <div
            ref={modalRef}
            className={`absolute z-[300050] max-h-[26.3rem] max-w-[75vw] overflow-y-auto translate-y-full cursor-default -bottom-4 shadow-xl rounded-t-sm rounded-b-lg !text-cyan-800 ${
                optionRef.current?.offsetLeft > width / 3 ? 'right-0' : 'left-0'
            } filter-modal bg-white px-4 py-3`}
        >
            {content}
        </div>
    );
};

export default FilterModal;
