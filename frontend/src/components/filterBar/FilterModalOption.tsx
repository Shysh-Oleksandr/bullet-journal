import React, { useEffect, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';

interface FilterModalOptionProps {
    text: string;
    checkedAtStart?: boolean;
    onchange?: (label: string, checked?: boolean) => void;
    showCheckmark?: boolean;
    canToggle?: boolean;
    forceCheck?: boolean;
    refToClick?: React.MutableRefObject<HTMLDivElement>;
}

const FilterModalOption = ({ text, onchange, checkedAtStart, showCheckmark = true, canToggle = true, forceCheck, refToClick }: FilterModalOptionProps) => {
    const [checked, setChecked] = useState<boolean>(checkedAtStart === undefined ? true : checkedAtStart);

    useEffect(() => {
        forceCheck !== undefined && setChecked(forceCheck);
    }, [forceCheck]);

    return (
        <label
            htmlFor={`option-checkbox_${text}`}
            className={`block sm:text-xl text-lg filter-modal-option relative px-10 sm:py-2 py-1 border-solid border-2 w-full border-cyan-100 rounded-md sm:mb-3 mb-2 cursor-pointer transition-all ${
                checked ? 'bg-cyan-600 border-cyan-600 text-white' : ''
            } hover:bg-cyan-500 hover:text-white duration-300 hover:shadow-md hover:border-cyan-500`}
        >
            <input
                checked={forceCheck === undefined ? checked : forceCheck}
                type="checkbox"
                onChange={(e) => {
                    canToggle && setChecked(e.target.checked);
                    onchange && onchange(text, !checked);
                    setTimeout(() => {
                        refToClick?.current && refToClick?.current.click();
                    }, 0);
                }}
                className="hidden"
                id={`option-checkbox_${text}`}
            />
            <span className="option-checkbox inline-block transition-all duration-300 absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-transparent text-2xl">
                {checked && showCheckmark && <AiOutlineCheck />}
            </span>
            {text}
        </label>
    );
};

export default FilterModalOption;
