import React, { useEffect, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';

interface FilterModalOptionProps {
    text: string;
    onchange?: (label: string, isFirstIteration?: boolean) => void;
    checkedAtStart?: boolean;
}

const FilterModalOption = ({ text, onchange, checkedAtStart }: FilterModalOptionProps) => {
    const [checked, setChecked] = useState<boolean>(checkedAtStart === undefined ? true : checkedAtStart);

    useEffect(() => {
        onchange && onchange(text, true);
    }, []);

    return (
        <label
            htmlFor={`option-checkbox_${text}`}
            className={`block text-xl filter-modal-option relative px-10 py-2 border-solid border-2 w-full border-cyan-100 rounded-md mb-3 cursor-pointer transition-all ${
                checked ? 'bg-cyan-600 border-cyan-600 text-white' : ''
            } hover:bg-cyan-500 hover:text-white duration-300 hover:shadow-md hover:border-cyan-500`}
        >
            <input
                checked={checked}
                type="checkbox"
                onChange={(e) => {
                    setChecked(e.target.checked);
                    onchange && onchange(text);
                }}
                className="hidden"
                id={`option-checkbox_${text}`}
            />
            <span className="option-checkbox inline-block transition-all duration-300 absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-transparent text-2xl">{checked && <AiOutlineCheck />}</span>
            {text}
        </label>
    );
};

export default FilterModalOption;
