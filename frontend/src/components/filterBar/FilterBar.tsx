import React, { memo, useCallback, useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { getCustomCategories, getCustomTypes, getIsFilterBarShown, getOldestNoteDate, setShowFilterBar } from '../../features/journal/journalSlice';
import { Note } from '../../features/journal/types';
import { useDebounce } from '../../hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '../../store/helpers/storeHooks';
import { SortOptions, filterOptions, getLastPeriodDate } from './../../utils/data';
import { getContentWords } from './../../utils/functions';
import FilterOption from './FilterOption';
import FilterSearchInput from './FilterSearchInput';

interface FilterBarProps {
  filterBarRef: React.MutableRefObject<HTMLDivElement>;
  setShowFullAddForm: React.Dispatch<React.SetStateAction<boolean>>;
}

// TODO: Handle correctly
const FilterBar = ({ filterBarRef, setShowFullAddForm }: FilterBarProps) => {
  const dispatch = useAppDispatch();

  const oldestNoteDate = useAppSelector(getOldestNoteDate);
  const isFilterBarShown = useAppSelector(getIsFilterBarShown);

  const allCategories = useAppSelector(getCustomCategories);
  const allTypes = useAppSelector(getCustomTypes);

  const [wasReset, setWasReset] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState(SortOptions.NEWEST);
  const [startDate, setStartDate] = useState(oldestNoteDate);

  const [endDate, setEndDate] = useState(new Date().getTime());
  const [type, setType] = useState(allTypes.map((label) => label.labelName));
  const [category, setCategory] = useState(allCategories.map((label) => label.labelName));
  const [showAnyCategory, setShowAnyCategory] = useState(true);
  const [showAnyType, setShowAnyType] = useState(true);
  const [importanceMin, setImportanceMin] = useState(1);
  const [importanceMax, setImportanceMax] = useState(10);

  const filterData = { sortType, startDate, endDate, type, category, importanceMin, importanceMax, showAnyCategory, wasReset, oldestNoteDate, showAnyType, allTypes, allCategories };
  const filterDataSetters = { setSortType, setStartDate, setEndDate, setType, setCategory, setImportanceMin, setImportanceMax, setShowAnyCategory, setShowAnyType };
  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const debouncedStartDate = useDebounce(startDate, 500);
  const debouncedEndDate = useDebounce(endDate, 500);

  const debouncedType = useDebounce(type, 500);
  const debouncedCategory = useDebounce(category, 500);

  const sort = useCallback(
    (notes: Note[]) => {
      const sortedNotes = notes.sort((x, y) => {
        switch (sortType) {
          case SortOptions.NEWEST:
            return y.startDate - x.startDate;
          case SortOptions.OLDEST:
            return x.startDate - y.startDate;

          case SortOptions.IMPORTANCE:
            return y.rating - x.rating;

          case SortOptions.TYPE:
            if (!y.type) return 0;

            return y.type?.labelName.localeCompare(x.type?.labelName ?? '');

          case SortOptions.CATEGORY:
            const xCategory = x.category;
            const yCategory = y.category;
            if (xCategory && yCategory) {
              return yCategory?.length - xCategory?.length;
            } else if (xCategory) {
              return -1;
            } else {
              return 1;
            }
          case SortOptions.CONTENT:
            return getContentWords(y.content || '') - getContentWords(x.content || '');

          case SortOptions.ALPHABETICAL:
            return x.title.localeCompare(y.title);

          default:
            return y.startDate - x.startDate;
        }
      });

      return sortedNotes;
    },
    [sortType]);

  const filter = (notes: Note[]) => {
    const filteredNotes = notes.filter((note) => {
      const titleFilter = note.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const typeFilter = showAnyType || (note.type && debouncedType.includes(note.type?.labelName));
      const categoryFilter = showAnyCategory ? true : note.category?.map((c) => c.labelName).some((r) => debouncedCategory.includes(r));
      const dateFilter = note.startDate >= debouncedStartDate && note.startDate <= getLastPeriodDate(-1, debouncedEndDate);
      const importanceFilter = note.rating >= importanceMin && note.rating <= importanceMax;

      return titleFilter && typeFilter && categoryFilter && importanceFilter && dateFilter;
    });

    return filteredNotes;
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSortType(SortOptions.NEWEST);
    setEndDate(new Date().getTime());
    setType([]);
    setCategory([]);
    setShowAnyType(true);
    setShowAnyCategory(true);
    setImportanceMin(1);
    setImportanceMax(10);

    setWasReset(!wasReset);
  };

  useEffect(() => {
    setStartDate(oldestNoteDate);
  }, [oldestNoteDate]);

  return (
    <div
      ref={filterBarRef}
      className={`w-full absolute top-0 z-[99] left-0 right-0 pb-4 pt-2 rounded-b-xl shadow-md duration-500 ease-in-out bg-white px-[3vw] ${isFilterBarShown ? '' : '-translate-y-[92%] max-h-36'
        }`}
    >
      <div className={`fl justify-between flex-wrap transition-all duration-300 ${isFilterBarShown ? 'delay-300' : 'opacity-0 invisible'}`}>
        {filterOptions.map((option) => {
          return <FilterOption setShowFullAddForm={setShowFullAddForm} option={option} key={option.name} filterData={filterData} filterDataSetters={filterDataSetters} />;
        })}
        <FilterSearchInput
          inputClassName="filter-search-input rounded-lg py-3 h-full min-w-[12rem] pr-8  hover:text-white focus-within:text-white focus-within:bg-cyan-600 hover:bg-cyan-600 focus-within:placeholder:text-white hover:placeholder:text-white"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          className="mx-3 mt-2"
        />
      </div>
      <span
        onClick={() => dispatch(setShowFilterBar(!isFilterBarShown))}
        className={`text-4xl absolute -bottom-7 text-cyan-600 z-50 cursor-pointer transition-all duration-300 block right-4 ${isFilterBarShown ? 'rotate-180' : ''} hover:text-cyan-700`}
      >
        <IoIosArrowDown />
      </span>
      <span
        onClick={resetFilters}
        className={`text-lg absolute -bottom-[22px] px-[6px] py-[1px] bg-cyan-500 text-white rounded-lg z-50 cursor-pointer transition-all duration-300 block right-16  hover:bg-cyan-600`}
      >
        Reset
      </span>
    </div>
  );
};

export default memo(FilterBar)
