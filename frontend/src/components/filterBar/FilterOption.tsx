import React from 'react';
import { IFilterOption } from './../../utils/data';
import { IoIosArrowDown } from 'react-icons/io';

interface FilterOptionProps {
    option: IFilterOption;
}

const FilterOption = ({ option }: FilterOptionProps) => {
    return (
        <button className="filter-option flex-between mx-3 px-4 py-3 mt-2 flex-1 rounded-lg shadow-md text-cyan-700 transition-all duration-[250ms] hover:bg-cyan-600 hover:text-white hover:shadow-lg">
            <div className="fl">
                <span className="text-2xl mr-2">{<option.icon />}</span>
                <h4 className="text-lg whitespace-nowrap">{option.name}</h4>
            </div>
            {option.isDropdown && (
                <span className="text-2xl ml-1 text-cyan-500 filter-arrow transition-all duration-[250ms]">
                    <IoIosArrowDown />
                </span>
            )}
        </button>
    );
};

export default FilterOption;
