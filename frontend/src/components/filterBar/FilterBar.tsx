import React, { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useAppSelector } from '../../app/hooks';
import { filterNotes } from '../../features/journal/journalSlice';
import { useDebounce } from '../../hooks';
import { useAppDispatch } from './../../app/hooks';
import { updateUserData } from './../../features/user/userSlice';
import { defaultNoteTypes, filterOptions, SEPARATOR } from './../../utils/data';
import FilterOption from './FilterOption';
import FilterSearchInput from './FilterSearchInput';
import { getAllLabels } from './../../utils/functions';

interface FilterBarProps {
    filterBarRef: React.MutableRefObject<HTMLDivElement>;
}

const FilterBar = ({ filterBarRef }: FilterBarProps) => {
    const { user } = useAppSelector((store) => store.user);
    const { notes } = useAppSelector((store) => store.journal);
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortType, setSortType] = useState<string>('');
    const [startDate, setStartDate] = useState<number>(notes.at(-1)?.startDate || 1);
    const [endDate, setEndDate] = useState<number>(new Date().getTime());
    const [type, setType] = useState<string[]>(getAllLabels(defaultNoteTypes, user.customNoteTypes));
    const [category, setCategory] = useState<string[]>(getAllLabels([], user.customNoteCategories));
    const [importance, setImportance] = useState<number>(1);

    const filterData = { sortType, startDate, endDate, type, category, importance };
    const filterDataSetters = { setSortType, setStartDate, setEndDate, setType, setCategory, setImportance };
    const debouncedSearchTerm = useDebounce(searchQuery, 500);
    const debouncedStartDate = useDebounce(startDate, 500);
    const debouncedEndDate = useDebounce(endDate, 500);
    const debouncedType = useDebounce(type, 500);
    const debouncedCategory = useDebounce(category, 500);
    const debouncedImportance = useDebounce(importance, 500);

    useEffect(() => {
        console.log('filter');
        dispatch(filterNotes({ user, title: debouncedSearchTerm, type: type }));
    }, [sortType, debouncedStartDate, debouncedEndDate, debouncedType, debouncedCategory, debouncedImportance, debouncedSearchTerm]);

    return (
        <div
            ref={filterBarRef}
            className={`w-full absolute top-0 z-[99] left-0 right-0 pb-4 pt-2 rounded-b-xl shadow-md duration-500 ease-in-out bg-white fl justify-between flex-wrap px-[3vw] ${
                user.isFilterBarShown ? '' : '-translate-y-[92%] max-h-36'
            }`}
        >
            {filterOptions.map((option) => {
                return <FilterOption option={option} key={option.name} filterData={filterData} filterDataSetters={filterDataSetters} />;
            })}
            <FilterSearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <span
                onClick={() => dispatch(updateUserData({ oldUser: user, newUserData: { isFilterBarShown: !user.isFilterBarShown } }))}
                className={`text-4xl absolute -bottom-7 text-cyan-600 z-50 cursor-pointer transition-all duration-300 block right-4 ${user.isFilterBarShown ? 'rotate-180' : ''} hover:text-cyan-700`}
            >
                <IoIosArrowDown />
            </span>
        </div>
    );
};

export default FilterBar;
