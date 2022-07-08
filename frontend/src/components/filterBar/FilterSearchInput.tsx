import React, { useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { AiOutlineSearch } from 'react-icons/ai';

interface FilterSearchInputProps {
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    searchQuery: string;
}

const FilterSearchInput = ({ setSearchQuery, searchQuery }: FilterSearchInputProps) => {
    const [searchFocus, setSearchFocus] = useState<boolean>(false);

    return (
        <div className="filter-option relative flex-between mx-3 mt-2 flex-1 rounded-lg shadow-md text-cyan-700 transition-all duration-[250ms] hover:text-white hover:shadow-lg">
            <input
                type="text"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
                id="filter-note-search-input"
                className={`filter-search-input text-lg whitespace-nowrap block py-3 ${
                    searchFocus ? 'pl-2' : 'pl-10'
                } w-full  bg-white text-cyan-700 h-full rounded-lg min-w-[12rem] pr-8 transition-all duration-[250ms] hover:text-white focus-within:text-white focus-within:bg-cyan-600 hover:bg-cyan-600 focus-within:placeholder:text-white hover:placeholder:text-white`}
                placeholder="Search"
            />

            <label
                htmlFor="filter-note-search-input"
                onClick={() => setSearchQuery('')}
                className={`filter-search-delete text-2xl absolute right-2 top-1/2 rotate-45 ${
                    searchFocus ? 'text-white' : 'text-cyan-600'
                } -translate-y-1/2 transition-all cursor-pointer duration-[250ms] ${searchQuery.length > 0 ? 'opacity-100' : 'opacity-0 invisible'}`}
            >
                {<BsPlusLg />}
            </label>
            <label
                htmlFor="filter-note-search-input"
                className={`text-2xl absolute left-2 top-1/2 -translate-y-1/2 transition-all duration-[250ms] ${searchFocus ? 'opacity-0 invisible' : 'opacity-100'}`}
            >
                {<AiOutlineSearch />}
            </label>
        </div>
    );
};

export default FilterSearchInput;
