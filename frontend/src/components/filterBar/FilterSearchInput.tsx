import React, { useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { AiOutlineSearch } from 'react-icons/ai';

interface FilterSearchInputProps {
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    searchQuery: string;
    inputClassName?: string;
    className?: string;
    labelClassName?: string;
    deleteClassName?: string;
    isSidebar?: boolean;
}

const FilterSearchInput = ({ setSearchQuery, isSidebar, searchQuery, className, inputClassName, labelClassName, deleteClassName }: FilterSearchInputProps) => {
    const [searchFocus, setSearchFocus] = useState<boolean>(false);

    return (
        <div className={`filter-option relative flex-between flex-1 basis-[15%] rounded-lg shadow-md text-cyan-700 transition-all duration-[250ms] hover:text-white hover:shadow-lg ${className}`}>
            <input
                type="text"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
                id={`${isSidebar ? 'filter' : 'sidebar'}'-note-search-input'`}
                className={`text-lg whitespace-nowrap ${searchFocus ? '!pl-2' : '!pl-12'}  block w-full  bg-white text-cyan-700 transition-all duration-[250ms] ${inputClassName}`}
                placeholder="Search"
            />

            <label
                htmlFor={`${isSidebar ? 'filter' : 'sidebar'}'-note-search-input'`}
                onClick={() => setSearchQuery('')}
                className={`filter-search-delete text-2xl absolute right-2 top-1/2 rotate-45 ${
                    searchFocus ? 'text-white' : 'text-cyan-600'
                } -translate-y-1/2 transition-all cursor-pointer duration-[250ms] ${searchQuery.length > 0 ? 'opacity-100' : 'opacity-0 invisible'} ${deleteClassName}`}
            >
                {<BsPlusLg />}
            </label>
            <label
                htmlFor={`${isSidebar ? 'filter' : 'sidebar'}'-note-search-input'`}
                className={`text-2xl absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-[250ms] ${searchFocus ? 'opacity-0 invisible' : 'opacity-100'} ${labelClassName}`}
            >
                {<AiOutlineSearch />}
            </label>
        </div>
    );
};

export default FilterSearchInput;
