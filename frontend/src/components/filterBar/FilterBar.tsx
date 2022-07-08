import React, { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useAppSelector } from '../../app/hooks';
import { filterNotes } from '../../features/journal/journalSlice';
import { useDebounce } from '../../hooks';
import { useAppDispatch } from './../../app/hooks';
import { updateUserData } from './../../features/user/userSlice';
import { defaultNoteTypes, filterOptions, getLastPeriodDate, SEPARATOR } from './../../utils/data';
import { getAllLabels } from './../../utils/functions';
import FilterOption from './FilterOption';
import FilterSearchInput from './FilterSearchInput';
import INote from './../../interfaces/note';

interface FilterBarProps {
    filterBarRef: React.MutableRefObject<HTMLDivElement>;
}

const FilterBar = ({ filterBarRef }: FilterBarProps) => {
    const { user } = useAppSelector((store) => store.user);
    const { notes } = useAppSelector((store) => store.journal);
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortType, setSortType] = useState<string>('');
    const [veryStartDate, setVeryStartDate] = useState(notes.at(-1)?.startDate || 1);
    const [startDate, setStartDate] = useState<number>(veryStartDate);
    const [endDate, setEndDate] = useState<number>(new Date().getTime());
    const allTypes = getAllLabels(defaultNoteTypes, user.customNoteTypes);
    const allCategories = getAllLabels([], user.customNoteCategories);
    const [type, setType] = useState<string[]>(allTypes);
    const [category, setCategory] = useState<string[]>(allCategories);
    const [showNoCategory, setShowNoCategory] = useState<boolean>(true);
    const [importanceMin, setImportanceMin] = useState<number>(1);
    const [importanceMax, setImportanceMax] = useState<number>(10);

    const filterData = { sortType, startDate, endDate, type, category, importanceMin, importanceMax, showNoCategory, veryStartDate };
    const filterDataSetters = { setSortType, setStartDate, setEndDate, setType, setCategory, setImportanceMin, setImportanceMax, setShowNoCategory };
    const debouncedSearchTerm = useDebounce(searchQuery, 500);
    const debouncedStartDate = useDebounce(startDate, 500);
    const debouncedEndDate = useDebounce(endDate, 500);
    const debouncedShowNoCategory = useDebounce(showNoCategory, 500);
    const debouncedType: string[] = useDebounce(type, 500);
    const debouncedCategory: string[] = useDebounce(category, 500);
    const debouncedImportanceMin = useDebounce(importanceMin, 500);
    const debouncedImportanceMax = useDebounce(importanceMax, 500);

    const filter = (notes: INote[]) => {
        const filteredNotes = notes.filter((note) => {
            const typeFilter = debouncedType.includes(note.type);
            const categoryFilter = note.category?.split(SEPARATOR).some((r) => debouncedCategory.includes(r)) || (showNoCategory && !note.category);
            const dateFilter = note.startDate >= debouncedStartDate && note.startDate <= getLastPeriodDate(-1, debouncedEndDate);
            const importanceFilter = note.rating >= importanceMin && note.rating <= importanceMax;

            return typeFilter && categoryFilter && dateFilter && importanceFilter;
        });

        return filteredNotes;
    };

    useEffect(() => {
        console.log('filter');

        dispatch(filterNotes({ user, title: debouncedSearchTerm, filter }));
    }, [sortType, debouncedStartDate, debouncedEndDate, debouncedType, debouncedCategory, debouncedImportanceMin, debouncedImportanceMax, debouncedSearchTerm, debouncedShowNoCategory]);

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
