import React from 'react';
import FilterModalOption from './FilterModalOption';

interface FilterModalProps {
    modalRef: React.MutableRefObject<HTMLDivElement>;
    content: JSX.Element | string;
}

const FilterModal = ({ modalRef, content }: FilterModalProps) => {
    return (
        <div ref={modalRef} className="absolute z-[250] translate-y-full cursor-default -bottom-4 shadow-xl rounded-t-sm rounded-b-lg !text-cyan-800 left-0 min-w-[25vw] bg-white px-4 py-3">
            {content}
        </div>
    );
};

export default FilterModal;
